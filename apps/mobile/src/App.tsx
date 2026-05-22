import { Button } from '@quietcut/ui';

/**
 * Mobile scaffold. The full mobile UX (touch-first timeline, share sheet,
 * background processing) lands in Phase 6. For now this renders a smoke-test
 * screen so Capacitor + Vite + Tailwind are validated end-to-end.
 */
export function App() {
  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-3">
        <h1 className="text-base font-semibold">Quietcut</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="text-xl font-medium">Mobile build — Phase 0</h2>
        <p className="text-sm text-zinc-400">
          The mobile flow is scaffolded. File picker + FFmpegKit integration arrives in Phase 1.
        </p>
        <Button disabled>Open file (soon)</Button>
      </main>
    </div>
  );
}
