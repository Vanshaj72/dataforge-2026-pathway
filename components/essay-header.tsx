export function EssayHeader() {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* subtle synaptic grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, var(--synaptic), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="rounded-full border border-synaptic/40 px-3 py-1 text-synaptic">
            Pathway · DataForge 2026
          </span>
          <span className="rounded-full border border-border px-3 py-1">
            Education Track
          </span>
        </div>

        <h1 className="mt-6 text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Synaptic Plasticity as Short-Term Memory
          <span className="mt-2 block font-mono text-lg font-medium text-muted-foreground sm:text-2xl">
            {'vs'} Transformer Key-Value Caching
          </span>
        </h1>

        <div className="mt-8 rounded-xl border border-border bg-card/60 p-5 backdrop-blur sm:p-7">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-synaptic">
            The 1-Sentence Claim
          </p>
          <p className="mt-3 text-balance text-lg leading-relaxed text-foreground sm:text-2xl">
            A neural network using{' '}
            <span className="text-synaptic">Hebbian synaptic writes</span>{' '}
            updates session memory incrementally in{' '}
            <span className="font-mono text-synaptic">O(1)</span> time without
            expanding a Key-Value cache, but experiences{' '}
            <span className="text-transformer">
              associative state interference
            </span>{' '}
            under high memory load.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
          <LegendDot className="bg-synaptic" label="BDH · Synaptic Memory" />
          <LegendDot className="bg-transformer" label="Transformer · KV Cache" />
          <span className="ml-auto hidden sm:inline">
            scroll to explore ↓
          </span>
        </div>
      </div>
    </header>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  )
}
