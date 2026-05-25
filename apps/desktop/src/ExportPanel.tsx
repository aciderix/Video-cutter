import { useEffect, useMemo, useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { Download, Files, Square } from 'lucide-react';
import { Button } from '@snipvox/ui';
import type { CleanAudioOverlay, MediaSource, Region } from '@snipvox/core';
import { LOUDNESS_PRESETS, loudnessFilterArg } from '@snipvox/core';
import {
  FILTER_COMPLEX_SEGMENT_THRESHOLD,
  FORMAT_PRESETS,
  buildFilterComplexExport,
  buildOverlayExport,
  buildPerRegionExport,
  buildSegmentedExport,
  defaultPresetFor,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
  findPreset,
  type FormatPreset,
} from '@snipvox/exporters';
import {
  cancelExport,
  formatBridgeError,
  pickDirectory,
  runExportCut,
  runExportSegmented,
  tempDir,
  writeFile,
} from './bridge.ts';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';

const NLE: Record<NleFormat, { label: string; ext: string; build: typeof exportEDL }> = {
  fcpxml: { label: 'Final Cut Pro XML', ext: 'fcpxml', build: exportFCPXML },
  otio: { label: 'OpenTimelineIO', ext: 'otio', build: exportOTIO },
  edl: { label: 'CMX 3600 EDL', ext: 'edl', build: exportEDL },
  resolve: { label: 'Resolve markers (TSV)', ext: 'txt', build: exportResolveMarkers },
};

interface Props {
  source: MediaSource;
  regions: Region[];
  projectName: string;
  selectedIds: Set<string>;
  overlays: CleanAudioOverlay[];
}

interface Progress {
  percent: number;
  outTimeMs: number;
  speed: number | null;
}

let exportCounter = 0;

export function ExportPanel({ source, regions, projectName, selectedIds, overlays }: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loudnessId, setLoudnessId] = useState<string>('none');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [formatId, setFormatId] = useState<string>(() => defaultPresetFor(source.hasVideo).id);
  const [audioMode, setAudioMode] = useState<'camera' | 'mix' | 'cleanOnly'>('mix');

  const usableOverlays = useMemo(
    () => overlays.filter((o) => o.enabled && o.segments.length > 0),
    [overlays],
  );
  const overlayAudioActive = audioMode !== 'camera' && usableOverlays.length > 0;

  // If the source changes between audio-only and video, snap to a sensible
  // default. Keep an explicit choice if it remains valid.
  useEffect(() => {
    const current = findPreset(formatId);
    if (!current) return setFormatId(defaultPresetFor(source.hasVideo).id);
    if (current.hasVideo && !source.hasVideo) {
      setFormatId(defaultPresetFor(false).id);
    }
  }, [source.hasVideo, formatId]);

  useEffect(() => {
    const unsub = listen<{
      jobId: string;
      outTimeMs: number;
      percent: number;
      speed: number | null;
    }>('export-progress', (e) => {
      setProgress({
        percent: e.payload.percent,
        outTimeMs: e.payload.outTimeMs,
        speed: e.payload.speed,
      });
    });
    return () => {
      void unsub.then((f) => f());
    };
  }, []);

  const preset = findPreset(formatId) ?? defaultPresetFor(source.hasVideo);
  const groupedFormats = useMemo(() => groupFormats(source.hasVideo), [source.hasVideo]);
  const selectedCount = selectedIds.size;
  const selectedDuration = useMemo(
    () =>
      regions.filter((r) => selectedIds.has(r.id)).reduce((acc, r) => acc + (r.end - r.start), 0),
    [regions, selectedIds],
  );

  const cancel = async () => {
    if (!activeJobId) return;
    await cancelExport(activeJobId).catch(() => {});
  };

  const exportEdit = async () => {
    setError(null);
    setStatus(null);
    const defaultName = `${baseName(source.name)}.cut${preset.extension}`;
    const outputPath = await save({
      defaultPath: defaultName,
      filters: [{ name: preset.label, extensions: [preset.extension.slice(1)] }],
    });
    if (!outputPath) return;
    if (selectedCount === 0) {
      setError('Nothing selected. Tick the regions you want to keep in the export.');
      return;
    }

    setBusy(true);
    setProgress({ percent: 0, outTimeMs: 0, speed: null });
    const jobId = `export-${++exportCounter}`;
    setActiveJobId(jobId);
    try {
      const loudness = LOUDNESS_PRESETS.find((p) => p.id === loudnessId);
      const extraArgs: string[] = [];
      if (loudness) extraArgs.push('-af', loudnessFilterArg(loudness));

      if (overlayAudioActive) {
        // Clean-audio overlay path: filter_complex picks the right input
        // (camera vs each overlay) for every audio piece of every kept
        // region. Doesn't currently support the >50-segment concat fallback
        // because the graph grows with audio pieces, not just regions.
        const plan = buildOverlayExport(
          { source, regions, projectName },
          {
            outputPath,
            overlays: usableOverlays,
            cleanOnly: audioMode === 'cleanOnly',
            selectedIds,
            preset,
            extraArgs,
          },
        );
        await runExportCut({
          args: plan.args,
          expectedDurationS: plan.outputDurationS,
          jobId,
        });
        setStatus(
          `Wrote ${outputPath} — ${plan.segmentCount} segments, ${plan.audioPieces} audio pieces`,
        );
      } else if (selectedCount > FILTER_COMPLEX_SEGMENT_THRESHOLD) {
        // Many segments: per-segment cut + concat demuxer to dodge the
        // filter_complex OOM ceiling.
        const tmp = await tempDir();
        const plan = buildSegmentedExport(
          { source, regions, projectName },
          {
            outputPath,
            tmpDir: tmp,
            extension: preset.extension,
            preset,
            streamCopy: false,
            selectedIds,
          },
        );
        await runExportSegmented({
          segments: plan.segments.map((s) => s.args),
          concatArgs: plan.concatArgs,
          concatListPath: plan.concatListPath,
          concatListContent: plan.concatListContent,
          tmpPaths: plan.segments.map((s) => s.tmpPath),
          expectedDurationS: plan.outputDurationS,
          jobId,
        });
        setStatus(`Wrote ${outputPath} — ${plan.segments.length} segments via concat demuxer`);
      } else {
        const plan = buildFilterComplexExport(
          { source, regions, projectName },
          { outputPath, preset, extraArgs, selectedIds },
        );
        await runExportCut({
          args: plan.args,
          expectedDurationS: plan.outputDurationS,
          jobId,
        });
        setStatus(
          `Wrote ${outputPath} — ${plan.segmentCount} segments, ${plan.outputDurationS.toFixed(2)}s`,
        );
      }
    } catch (e) {
      setError(formatBridgeError(e));
    } finally {
      setBusy(false);
      setActiveJobId(null);
    }
  };

  const exportPerRegion = async () => {
    setError(null);
    setStatus(null);
    if (selectedCount === 0) {
      setError('Nothing selected.');
      return;
    }
    const dir = await pickDirectory();
    if (!dir) return;

    setBusy(true);
    setProgress({ percent: 0, outTimeMs: 0, speed: null });
    const jobId = `per-region-${++exportCounter}`;
    setActiveJobId(jobId);
    try {
      const plan = buildPerRegionExport(
        { source, regions, projectName },
        {
          outputDir: dir,
          basename: baseName(source.name),
          preset,
          selectedIds,
          streamCopy: false,
        },
      );
      const totalDur = plan.totalDurationS;
      let elapsed = 0;
      for (let i = 0; i < plan.segments.length; i++) {
        const seg = plan.segments[i]!;
        const segJobId = `${jobId}-${i}`;
        await runExportCut({
          args: seg.args,
          expectedDurationS: seg.durationS,
          jobId: segJobId,
        });
        elapsed += seg.durationS;
        setProgress({
          percent: (elapsed / totalDur) * 100,
          outTimeMs: elapsed * 1000,
          speed: null,
        });
      }
      setStatus(`Wrote ${plan.segments.length} files to ${dir}`);
    } catch (e) {
      setError(formatBridgeError(e));
    } finally {
      setBusy(false);
      setActiveJobId(null);
    }
  };

  const exportNle = async (format: NleFormat) => {
    setError(null);
    setStatus(null);
    const def = NLE[format];
    const defaultName = `${baseName(source.name)}.${def.ext}`;
    const outputPath = await save({
      defaultPath: defaultName,
      filters: [{ name: def.label, extensions: [def.ext] }],
    });
    if (!outputPath) return;
    try {
      const filteredRegions = regions.filter((r) => selectedIds.has(r.id));
      // NLE exporters take an ExportContext where kept=true means in-output.
      // Map the selection on top of kept so users can export a subset.
      const ctxRegions = regions.map((r) => ({
        ...r,
        kept: filteredRegions.includes(r),
      }));
      const content = def.build({
        source,
        regions: ctxRegions,
        projectName,
        overlays: usableOverlays,
      });
      await writeFile(outputPath, content);
      setStatus(`Wrote ${def.label} → ${outputPath}`);
    } catch (e) {
      setError(formatBridgeError(e));
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Export</h3>
          <p className="text-xs text-zinc-500">
            {selectedCount} / {regions.filter((r) => r.kept).length} kept regions selected ·{' '}
            {selectedDuration.toFixed(2)}s
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {busy && activeJobId && (
            <Button variant="danger" size="sm" onClick={cancel} className="gap-1.5">
              <Square size={12} fill="currentColor" /> Cancel
            </Button>
          )}
          <Button
            onClick={exportEdit}
            disabled={busy || selectedCount === 0}
            className="relative overflow-hidden bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-500 gap-1.5 font-semibold"
          >
            {busy && (
              <div className="absolute inset-0 bg-indigo-500/20">
                <div
                  className="h-full bg-indigo-500/70 transition-all duration-300"
                  style={{ width: `${progress?.percent ?? 0}%` }}
                />
              </div>
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Download size={14} />
              {busy
                ? `Exporting ${progress?.percent.toFixed(0) ?? 0}%`
                : `Export single ${preset.extension.slice(1).toUpperCase()}`}
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={exportPerRegion}
            disabled={busy || selectedCount === 0}
            title="One file per selected region"
            className="gap-1.5"
          >
            <Files size={14} /> Per segment ({selectedCount})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <label htmlFor="format-select" className="shrink-0">
            Format:
          </label>
          <select
            id="format-select"
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            disabled={busy}
            className="flex-1 min-w-0 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
          >
            {groupedFormats.video.length > 0 && (
              <optgroup label="Video">
                {groupedFormats.video.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Audio-only">
              {groupedFormats.audio.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <label htmlFor="loudness-select" className="shrink-0">
            Loudness:
          </label>
          <select
            id="loudness-select"
            value={loudnessId}
            onChange={(e) => setLoudnessId(e.target.value)}
            disabled={busy}
            className="flex-1 min-w-0 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
          >
            <option value="none">None (skip normalization)</option>
            {LOUDNESS_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {usableOverlays.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <label htmlFor="audio-mode" className="shrink-0">
            Audio source:
          </label>
          <select
            id="audio-mode"
            value={audioMode}
            onChange={(e) => setAudioMode(e.target.value as 'camera' | 'mix' | 'cleanOnly')}
            disabled={busy}
            className="flex-1 min-w-0 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
          >
            <option value="camera">Camera audio (ignore overlays)</option>
            <option value="mix">Mix: clean overlay where aligned, camera elsewhere</option>
            <option value="cleanOnly">Clean overlay only (silence where unaligned)</option>
          </select>
        </div>
      )}

      <p className="text-xs text-zinc-500">{preset.description}</p>

      {progress && busy && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {(progress.outTimeMs / 1000).toFixed(1)}s rendered
            {progress.speed ? ` · ${progress.speed.toFixed(2)}× speed` : ''}
          </p>
        </div>
      )}

      <div className="border-t border-zinc-800 pt-3">
        <p className="mb-2 text-xs text-zinc-500">
          Hand off to an NLE — uses selected regions; no re-encode.
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
            <Button
              key={fmt}
              variant="secondary"
              size="sm"
              onClick={() => exportNle(fmt)}
              disabled={busy || selectedCount === 0}
            >
              {NLE[fmt].label}
            </Button>
          ))}
        </div>
      </div>

      {status && <p className="text-xs text-emerald-400">{status}</p>}
      {error && (
        <p className="whitespace-pre-line text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function baseName(filename: string): string {
  return filename.replace(/\.[^./]+$/, '');
}

function groupFormats(hasVideo: boolean): { video: FormatPreset[]; audio: FormatPreset[] } {
  return {
    video: hasVideo ? FORMAT_PRESETS.filter((p) => p.hasVideo) : [],
    audio: FORMAT_PRESETS.filter((p) => !p.hasVideo),
  };
}
