import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline } from '@quietcut/timeline';
import {
  DEFAULT_DETECTION,
  buildRegionsFromSilences,
  outputDuration,
  samplesToPeaks,
  toggleKept,
  vadFromSamples,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import {
  buildFilterComplexExport,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
} from '@quietcut/exporters';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';

const NLE: Record<NleFormat, { label: string; ext: string; build: typeof exportEDL }> = {
  fcpxml: { label: 'FCPXML', ext: 'fcpxml', build: exportFCPXML },
  otio: { label: 'OTIO', ext: 'otio', build: exportOTIO },
  edl: { label: 'EDL', ext: 'edl', build: exportEDL },
  resolve: { label: 'Resolve markers', ext: 'txt', build: exportResolveMarkers },
};

export function App() {
  const [source, setSource] = useState<MediaSource | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [peaks, setPeaks] = useState<Float32Array | null>(null);
  const [settings, setSettings] = useState<SilenceDetectionSettings>(DEFAULT_DETECTION);
  const [currentTime, setCurrentTime] = useState(0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const samplesRef = useRef<Float32Array | null>(null);
  const sampleRateRef = useRef<number>(48_000);

  // Revoke any leftover object URL on unmount.
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const analyze = useCallback(
    async (file: File) => {
      setError(null);
      setStatus(`Loading ${file.name}…`);
      setBusy(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const ctx = new (
          window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
        )();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        // Mix down to mono for analysis.
        const mono = new Float32Array(audioBuffer.length);
        for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
          const data = audioBuffer.getChannelData(ch);
          for (let i = 0; i < data.length; i++) mono[i]! += data[i]! / audioBuffer.numberOfChannels;
        }
        samplesRef.current = mono;
        sampleRateRef.current = audioBuffer.sampleRate;
        void ctx.close();

        const src: MediaSource = {
          id: `m-${Date.now()}`,
          path: file.name,
          name: file.name,
          duration: audioBuffer.duration,
          hasVideo: file.type.startsWith('video/'),
          hasAudio: true,
          audioStream: {
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            codec: 'web-audio',
          },
        };

        const intervals = vadFromSamples(mono, audioBuffer.sampleRate, settings);
        const regs = buildRegionsFromSilences(audioBuffer.duration, intervals, settings);
        const wave = samplesToPeaks(mono, 1024);

        setSource(src);
        setRegions(regs);
        setPeaks(wave);
        setCurrentTime(0);

        // Object URL for the <video>/<audio> tag.
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        setObjectUrl(URL.createObjectURL(file));
        setStatus(`${regs.filter((r) => !r.kept).length} silences found`);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(false);
      }
    },
    [settings, objectUrl],
  );

  const reanalyze = useCallback(() => {
    const samples = samplesRef.current;
    const sr = sampleRateRef.current;
    if (!samples || !source) return;
    const intervals = vadFromSamples(samples, sr, settings);
    setRegions(buildRegionsFromSilences(source.duration, intervals, settings));
  }, [settings, source]);

  const shareNle = async (fmt: NleFormat) => {
    if (!source) return;
    setError(null);
    try {
      const def = NLE[fmt];
      const content = def.build({ source, regions, projectName: source.name });
      const filename = `${source.name.replace(/\.[^./]+$/, '')}.${def.ext}`;
      // Write to cache so we can hand a real file URI to the share sheet.
      const written = await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      try {
        await Share.share({
          title: `Quietcut — ${def.label}`,
          text: `${def.label} export from Quietcut`,
          url: written.uri,
          dialogTitle: `Share ${filename}`,
        });
        setStatus(`Shared ${filename}`);
      } catch {
        // Share may be unavailable in web preview — surface the path so users
        // can grab the file from the file system.
        setStatus(`Saved to ${written.uri}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const previewFfmpegCmd = () => {
    if (!source) return;
    try {
      const plan = buildFilterComplexExport(
        { source, regions, projectName: source.name },
        { outputPath: `output.mp4` },
      );
      const cmd = ['ffmpeg', ...plan.args].join(' ');
      navigator.clipboard?.writeText(cmd).catch(() => {});
      setStatus(`FFmpeg command copied (${plan.segmentCount} segments)`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void analyze(f);
    e.target.value = '';
  };

  const onSeek = (t: number) => setCurrentTime(t);
  const onRegionToggle = (id: string) => setRegions((r) => toggleKept(r, id));

  const keptOut = outputDuration(regions);

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold">Quietcut</h1>
        <label className="cursor-pointer text-xs text-indigo-300 hover:text-indigo-200">
          Open file
          <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
        </label>
      </header>
      <main className="flex flex-1 flex-col gap-3 overflow-auto p-4">
        {status && <p className="text-xs text-emerald-400">{status}</p>}
        {error && (
          <p role="alert" className="rounded-md bg-rose-950 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}
        {!source && (
          <div className="m-auto flex flex-col items-center gap-3 text-center">
            <h2 className="text-lg font-medium">Pick a video or audio file</h2>
            <p className="max-w-xs text-sm text-zinc-400">
              On-device silence detection — no network, no upload. Exports an FCPXML / OTIO / EDL /
              Resolve marker file via the OS share sheet.
            </p>
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white">
                {busy ? 'Loading…' : 'Choose file'}
              </span>
              <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        )}
        {source && (
          <>
            <div>
              <p className="text-sm">{source.name}</p>
              <p className="text-xs text-zinc-500">
                {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences ·
                output {keptOut.toFixed(1)}s
              </p>
            </div>
            {objectUrl && source.hasVideo && (
              <video
                src={objectUrl}
                controls
                className="aspect-video w-full rounded bg-black"
                preload="metadata"
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
              />
            )}
            {objectUrl && !source.hasVideo && (
              <audio
                src={objectUrl}
                controls
                className="w-full"
                preload="metadata"
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
              />
            )}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2">
              <WaveformTimeline
                peaks={peaks}
                regions={regions}
                duration={source.duration}
                currentTime={currentTime}
                onSeek={onSeek}
                onRegionClick={onRegionToggle}
                height={100}
              />
            </div>
            <details className="rounded-lg border border-zinc-800 bg-zinc-900 p-3" open>
              <summary className="cursor-pointer text-sm font-medium">Detection</summary>
              <div className="space-y-4 pt-3">
                <Field label={`Threshold ${settings.thresholdDb} dB`}>
                  <Slider
                    ariaLabel="Threshold"
                    value={settings.thresholdDb}
                    onValueChange={(v) => setSettings({ ...settings, thresholdDb: v })}
                    min={-60}
                    max={-10}
                    step={1}
                  />
                </Field>
                <Field label={`Min silence ${settings.minSilenceDurationMs} ms`}>
                  <Slider
                    ariaLabel="Min silence"
                    value={settings.minSilenceDurationMs}
                    onValueChange={(v) => setSettings({ ...settings, minSilenceDurationMs: v })}
                    min={100}
                    max={3000}
                    step={50}
                  />
                </Field>
                <Field label={`Padding ${settings.paddingMs} ms`}>
                  <Slider
                    ariaLabel="Padding"
                    value={settings.paddingMs}
                    onValueChange={(v) => setSettings({ ...settings, paddingMs: v })}
                    min={0}
                    max={500}
                    step={10}
                  />
                </Field>
                <Button size="sm" onClick={reanalyze} className="w-full">
                  Re-analyze
                </Button>
              </div>
            </details>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 space-y-2">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Share to editor</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
                  <Button key={fmt} size="sm" variant="secondary" onClick={() => shareNle(fmt)}>
                    {NLE[fmt].label}
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={previewFfmpegCmd} className="w-full">
                Copy FFmpeg command
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
