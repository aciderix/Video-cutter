import { useEffect, useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { Button } from '@quietcut/ui';
import type { MediaSource, Region } from '@quietcut/core';
import { buildFilterComplexExport } from '@quietcut/exporters';
import { runExportCut } from './bridge.ts';

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
    try {
      const plan = buildFilterComplexExport(
        { source, regions, projectName },
        { outputPath, extraArgs: ['-preset', 'veryfast', '-crf', '20'] },
      );
      const jobId = `export-${++exportCounter}`;
      const result = await runExportCut({
        args: plan.args,
        expectedDurationS: plan.outputDurationS,
        jobId,
      });
      setStatus(
        `Wrote ${outputPath} (${plan.segmentCount} segments, ${plan.outputDurationS.toFixed(2)}s)`,
      );
      void result;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
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
        <Button onClick={exportSingleFile} disabled={busy || keptCount === 0}>
          {busy ? `Exporting… ${progress?.percent.toFixed(0) ?? 0}%` : 'Export single MP4'}
        </Button>
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
      {status && <p className="text-xs text-emerald-400">{status}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
