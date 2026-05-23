import { useEffect, useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { Button } from '@quietcut/ui';
import type { MediaSource, Region } from '@quietcut/core';
import { LOUDNESS_PRESETS, loudnessFilterArg } from '@quietcut/core';
import {
  FILTER_COMPLEX_SEGMENT_THRESHOLD,
  buildFilterComplexExport,
  buildSegmentedExport,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
} from '@quietcut/exporters';
import { keptRegions } from '@quietcut/core';
import { cancelExport, runExportCut, runExportSegmented, tempDir, writeFile } from './bridge.ts';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';

const NLE: Record<
  NleFormat,
  { label: string; ext: string; mime: string; build: typeof exportEDL }
> = {
  fcpxml: {
    label: 'Final Cut Pro XML',
    ext: 'fcpxml',
    mime: 'application/xml',
    build: exportFCPXML,
  },
  otio: { label: 'OpenTimelineIO', ext: 'otio', mime: 'application/json', build: exportOTIO },
  edl: { label: 'CMX 3600 EDL', ext: 'edl', mime: 'text/plain', build: exportEDL },
  resolve: {
    label: 'DaVinci Resolve markers (TSV)',
    ext: 'txt',
    mime: 'text/tab-separated-values',
    build: exportResolveMarkers,
  },
};

interface Props {
  source: MediaSource;
  regions: Region[];
  projectName: string;
}

interface Progress {
  percent: number;
  outTimeMs: number;
  speed: number | null;
}

let exportCounter = 0;

export function ExportPanel({ source, regions, projectName }: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loudnessId, setLoudnessId] = useState<string>('none');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

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

  const exportSingleFile = async () => {
    setError(null);
    setStatus(null);
    const defaultName = source.name.replace(/\.[^./]+$/, '') + '.cut.mp4';
    const outputPath = await save({
      defaultPath: defaultName,
      filters: [{ name: 'MP4', extensions: ['mp4'] }],
    });
    if (!outputPath) return;

    setBusy(true);
    setProgress({ percent: 0, outTimeMs: 0, speed: null });
    const jobId = `export-${++exportCounter}`;
    setActiveJobId(jobId);
    try {
      const preset = LOUDNESS_PRESETS.find((p) => p.id === loudnessId);
      const extraArgs = ['-preset', 'veryfast', '-crf', '20'];
      if (preset) extraArgs.push('-af', loudnessFilterArg(preset));

      const segmentCount = keptRegions(regions).length;
      if (segmentCount > FILTER_COMPLEX_SEGMENT_THRESHOLD) {
        // Per-segment cut + concat-demux: scales to thousands of regions.
        const tmp = await tempDir();
        const plan = buildSegmentedExport(
          { source, regions, projectName },
          { outputPath, tmpDir: tmp, extension: extOf(outputPath), streamCopy: false },
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
        setStatus(`Wrote ${outputPath} (${plan.segments.length} segments via concat demuxer)`);
      } else {
        // Single-pass filter_complex: fastest at small N.
        const plan = buildFilterComplexExport(
          { source, regions, projectName },
          { outputPath, extraArgs },
        );
        await runExportCut({
          args: plan.args,
          expectedDurationS: plan.outputDurationS,
          jobId,
        });
        setStatus(
          `Wrote ${outputPath} (${plan.segmentCount} segments, ${plan.outputDurationS.toFixed(2)}s)`,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setActiveJobId(null);
    }
  };

  const cancel = async () => {
    if (!activeJobId) return;
    await cancelExport(activeJobId).catch(() => {});
  };

  const extOf = (p: string): string => {
    const m = p.match(/(\.[^./\\]+)$/);
    return m ? m[1]! : '.mp4';
  };

  const exportNle = async (format: NleFormat) => {
    setError(null);
    setStatus(null);
    const def = NLE[format];
    const defaultName = source.name.replace(/\.[^./]+$/, '') + '.' + def.ext;
    const outputPath = await save({
      defaultPath: defaultName,
      filters: [{ name: def.label, extensions: [def.ext] }],
    });
    if (!outputPath) return;
    try {
      const content = def.build({ source, regions, projectName });
      await writeFile(outputPath, content);
      setStatus(`Wrote ${def.label} → ${outputPath}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const keptCount = regions.filter((r) => r.kept).length;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Export</h3>
          <p className="text-xs text-zinc-500">
            {keptCount} kept · {regions.filter((r) => !r.kept).length} cuts
          </p>
        </div>
        <div className="flex gap-2">
          {busy && activeJobId && (
            <Button variant="danger" size="sm" onClick={cancel}>
              Cancel
            </Button>
          )}
          <Button onClick={exportSingleFile} disabled={busy || keptCount === 0}>
            {busy ? `Exporting… ${progress?.percent.toFixed(0) ?? 0}%` : 'Export single MP4'}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <label htmlFor="loudness-select">Loudness:</label>
        <select
          id="loudness-select"
          value={loudnessId}
          onChange={(e) => setLoudnessId(e.target.value)}
          disabled={busy}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
        >
          <option value="none">None (skip normalization)</option>
          {LOUDNESS_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
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
        <p className="mb-2 text-xs text-zinc-500">Hand off to an NLE — no re-encode needed.</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
            <Button
              key={fmt}
              variant="secondary"
              size="sm"
              onClick={() => exportNle(fmt)}
              disabled={busy || keptCount === 0}
            >
              {NLE[fmt].label}
            </Button>
          ))}
        </div>
      </div>
      {status && <p className="text-xs text-emerald-400">{status}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
