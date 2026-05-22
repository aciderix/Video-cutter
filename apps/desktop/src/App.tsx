import { useState } from 'react';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline } from '@quietcut/timeline';
import {
  DEFAULT_DETECTION,
  buildRegionsFromSilences,
  outputDuration,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import { useStore } from './store.ts';
import { pickMediaFiles, analyzeMedia, runSilenceDetection, computePeaks } from './bridge.ts';

export function App() {
  const source = useStore((s) => s.source);
  const regions = useStore((s) => s.regions);
  const peaks = useStore((s) => s.peaks);
  const setSource = useStore((s) => s.setSource);
  const setRegions = useStore((s) => s.setRegions);
  const setPeaks = useStore((s) => s.setPeaks);
  const [settings, setSettings] = useState<SilenceDetectionSettings>(DEFAULT_DETECTION);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setError(null);
    try {
      const paths = await pickMediaFiles();
      if (paths.length === 0) return;
      setBusy(true);
      setPeaks(null);
      const src = await analyzeMedia(paths[0]!);
      setSource(src);
      const [silences, wavePeaks] = await Promise.all([
        runSilenceDetection(src.path, settings),
        computePeaks(src.path, 2048).catch(() => null),
      ]);
      setRegions(buildRegionsFromSilences(src.duration, silences, settings));
      if (wavePeaks) setPeaks(wavePeaks);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const reanalyze = async () => {
    if (!source) return;
    setBusy(true);
    setError(null);
    try {
      const silences = await runSilenceDetection(source.path, settings);
      setRegions(buildRegionsFromSilences(source.duration, silences, settings));
      if (!peaks) {
        const wavePeaks = await computePeaks(source.path, 2048).catch(() => null);
        if (wavePeaks) setPeaks(wavePeaks);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex flex-1 min-h-0">
        <Sidebar
          settings={settings}
          onSettingsChange={setSettings}
          onReanalyze={reanalyze}
          disabled={busy || !source}
        />
        <section className="flex flex-1 min-w-0 flex-col p-6">
          {!source ? (
            <EmptyState onOpen={open} busy={busy} />
          ) : (
            <SourceView source={source} regions={regions} peaks={peaks} busy={busy} />
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-md bg-rose-950 px-4 py-2 text-rose-200">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
      <h1 className="text-lg font-semibold tracking-tight">Quietcut</h1>
      <span className="text-xs text-zinc-500">v0.0.2 — Phase 1 core audio</span>
    </header>
  );
}

function EmptyState({ onOpen, busy }: { onOpen: () => void; busy: boolean }) {
  return (
    <div className="m-auto flex flex-col items-center gap-4 text-center">
      <h2 className="text-2xl font-medium">Open a video or audio file</h2>
      <p className="max-w-md text-zinc-400">
        Quietcut detects silences automatically and lets you export the trimmed result or send it to
        your favorite editor.
      </p>
      <Button size="lg" onClick={onOpen} disabled={busy}>
        {busy ? 'Loading…' : 'Choose file(s)'}
      </Button>
    </div>
  );
}

function SourceView({
  source,
  regions,
  peaks,
  busy,
}: {
  source: MediaSource;
  regions: Region[];
  peaks: Float32Array | null;
  busy: boolean;
}) {
  const savedSeconds = source.duration - outputDuration(regions);
  return (
    <>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-medium">{source.name}</h2>
          <p className="text-sm text-zinc-400">
            {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences · save{' '}
            {savedSeconds.toFixed(1)}s
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled>
            Export…
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2">
        <WaveformTimeline
          peaks={peaks}
          regions={regions}
          duration={source.duration}
          currentTime={0}
        />
      </div>
      {busy && <p className="mt-3 text-sm text-zinc-400">Analyzing…</p>}
    </>
  );
}

function Sidebar({
  settings,
  onSettingsChange,
  onReanalyze,
  disabled,
}: {
  settings: SilenceDetectionSettings;
  onSettingsChange: (s: SilenceDetectionSettings) => void;
  onReanalyze: () => void;
  disabled: boolean;
}) {
  return (
    <aside className="w-72 shrink-0 border-r border-zinc-800 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Detection
      </h3>
      <div className="space-y-5">
        <Field label={`Threshold: ${settings.thresholdDb} dB`}>
          <Slider
            ariaLabel="Silence threshold in decibels"
            value={settings.thresholdDb}
            onValueChange={(v) => onSettingsChange({ ...settings, thresholdDb: v })}
            min={-60}
            max={-10}
            step={1}
          />
        </Field>
        <Field label={`Min silence: ${settings.minSilenceDurationMs} ms`}>
          <Slider
            ariaLabel="Minimum silence duration"
            value={settings.minSilenceDurationMs}
            onValueChange={(v) => onSettingsChange({ ...settings, minSilenceDurationMs: v })}
            min={100}
            max={3000}
            step={50}
          />
        </Field>
        <Field label={`Padding: ${settings.paddingMs} ms`}>
          <Slider
            ariaLabel="Padding around speech"
            value={settings.paddingMs}
            onValueChange={(v) => onSettingsChange({ ...settings, paddingMs: v })}
            min={0}
            max={500}
            step={10}
          />
        </Field>
      </div>
      <Button className="mt-6 w-full" onClick={onReanalyze} disabled={disabled}>
        Re-analyze
      </Button>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
