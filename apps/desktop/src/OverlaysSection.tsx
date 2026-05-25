import { useState } from 'react';
import { Loader2, Plus, RotateCw, Trash2 } from 'lucide-react';
import { Button } from '@snipvox/ui';
import type { CleanAudioOverlay, MediaSource } from '@snipvox/core';
import { coveredReferenceDurationS } from '@snipvox/core';
import { alignClip, analyzeMedia, formatBridgeError, pickSingleMediaFile } from './bridge.ts';
import { useStore } from './store.ts';

interface Props {
  source: MediaSource;
  overlays: CleanAudioOverlay[];
}

/**
 * Sidebar-style section that lists the clean-audio overlays attached to
 * `source` and exposes the "add clean audio" workflow:
 *   1. user picks an audio file via the OS file dialog
 *   2. we analyze it through ffprobe to know its duration
 *   3. we run `align_clip` against the source on a background task
 *   4. the resulting AlignmentReport lands in the store
 *
 * Alignment is segmented by default so out-of-order multi-take clean
 * recordings each find their own home in the reference.
 */
export function OverlaysSection({ source, overlays }: Props) {
  const aligningOverlays = useStore((s) => s.aligningOverlays);
  const addOverlay = useStore((s) => s.addOverlay);
  const updateOverlay = useStore((s) => s.updateOverlay);
  const removeOverlay = useStore((s) => s.removeOverlay);
  const setAligning = useStore((s) => s.setAligning);
  const [error, setError] = useState<string | null>(null);

  const addCleanAudio = async () => {
    setError(null);
    const path = await pickSingleMediaFile();
    if (!path) return;
    let media;
    try {
      media = await analyzeMedia(path);
    } catch (e) {
      setError(`Could not analyze: ${formatBridgeError(e)}`);
      return;
    }
    if (!media.hasAudio) {
      setError(`${media.name} has no audio track.`);
      return;
    }
    const overlayId = `ov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const overlay: CleanAudioOverlay = {
      id: overlayId,
      name: media.name,
      path: media.path,
      durationS: media.duration,
      sampleRate: media.audioStream?.sampleRate ?? 48000,
      channels: media.audioStream?.channels ?? 1,
      segments: [],
      globalOffsetS: 0,
      globalConfidence: 0,
      enabled: true,
      hasVideo: media.hasVideo,
      videoStream: media.videoStream,
      audioStream: media.audioStream,
    };
    addOverlay(source.id, overlay);
    void runAlign(overlay);
  };

  const runAlign = async (overlay: CleanAudioOverlay) => {
    setAligning(overlay.id, true);
    setError(null);
    try {
      const report = await alignClip({
        referencePath: source.path,
        candidatePath: overlay.path,
        mode: 'segmented',
        chunkSeconds: 5,
        minConfidence: 0.2,
      });
      updateOverlay(source.id, overlay.id, {
        segments: report.segments,
        globalOffsetS: report.globalOffsetS,
        globalConfidence: report.globalConfidence,
      });
    } catch (e) {
      setError(`Align failed: ${formatBridgeError(e)}`);
    } finally {
      setAligning(overlay.id, false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Clean audio overlays</h3>
          <p className="text-[10px] text-zinc-500">
            Drop a separately-recorded voice take — SnipVox aligns it on the camera audio.
          </p>
        </div>
        <Button size="sm" onClick={addCleanAudio} className="gap-1.5">
          <Plus size={14} /> Clean audio
        </Button>
      </div>
      {overlays.length === 0 ? (
        <p className="px-3 py-3 text-xs text-zinc-500">
          No overlays. Add a clean recording (lavalier, studio mic, …) to replace the camera sound
          on export.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {overlays.map((o) => {
            const aligning = aligningOverlays.has(o.id);
            const covered = coveredReferenceDurationS(o);
            return (
              <li key={o.id} className="flex items-center gap-3 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={o.enabled}
                  onChange={(e) => updateOverlay(source.id, o.id, { enabled: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500"
                  title="Use this overlay for export"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{o.name}</p>
                  <p className="text-[10px] text-zinc-500">
                    {o.durationS.toFixed(1)}s source ·{' '}
                    {aligning ? (
                      <span className="text-amber-300 inline-flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> aligning
                      </span>
                    ) : o.segments.length === 0 ? (
                      <span className="text-zinc-500">not aligned</span>
                    ) : (
                      <>
                        {o.segments.length} segment{o.segments.length === 1 ? '' : 's'} ·{' '}
                        {covered.toFixed(1)}s covered ·{' '}
                        <ConfidenceBadge value={o.globalConfidence} />
                      </>
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => runAlign(o)}
                  disabled={aligning}
                  title="Re-run alignment"
                  className="!px-2"
                >
                  <RotateCw size={14} />
                </Button>
                <button
                  className="text-zinc-500 hover:text-rose-400 p-1.5"
                  onClick={() => removeOverlay(source.id, o.id)}
                  aria-label={`Remove ${o.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p className="px-3 py-2 text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  let color: string;
  if (value > 0.5) color = 'text-emerald-300';
  else if (value > 0.25) color = 'text-amber-300';
  else color = 'text-rose-300';
  return <span className={color}>{pct}% confidence</span>;
}
