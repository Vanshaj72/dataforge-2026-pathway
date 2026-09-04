'use client'

import { useMemo, useState } from 'react'
import { SectionLabel } from './memory-scaling'

const COLS = 24
const ROWS = 14
const TOTAL = COLS * ROWS
const SPARSE_THRESHOLD = 0.05 // ~5% active
const DENSE_THRESHOLD = 0.9 // ~90% active

// Deterministic pseudo-random value in [0,1) for a cell — stable across
// server/client render so there is no hydration mismatch.
function hash(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function ActivationToggle() {
  const [sparse, setSparse] = useState(true)

  const cells = useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => hash(i)),
    [],
  )

  const threshold = sparse ? SPARSE_THRESHOLD : DENSE_THRESHOLD
  const activeCount = cells.filter((v) => v < threshold).length
  const activePct = ((activeCount / TOTAL) * 100).toFixed(1)

  return (
    <section
      id="activations"
      className="scroll-mt-6 border-y border-border bg-card/30"
    >
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <SectionLabel index="02" title="Sparse vs Dense Activations" />
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          BDH activates only a tiny{' '}
          <span className="font-mono text-synaptic">~5%</span> of its units per
          step — sparse, non-negative, and interpretable. A Transformer&apos;s
          feed-forward block fires a{' '}
          <span className="font-mono text-transformer">dense</span> matrix where
          nearly every unit carries signal.
        </p>

        {/* toggle */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div
            role="tablist"
            aria-label="Activation mode"
            className="inline-flex rounded-full border border-border bg-background p-1"
          >
            <button
              role="tab"
              aria-selected={sparse}
              onClick={() => setSparse(true)}
              className={`rounded-full px-4 py-2 font-mono text-xs transition-colors ${
                sparse
                  ? 'bg-synaptic/15 text-synaptic'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              BDH · Sparse
            </button>
            <button
              role="tab"
              aria-selected={!sparse}
              onClick={() => setSparse(false)}
              className={`rounded-full px-4 py-2 font-mono text-xs transition-colors ${
                !sparse
                  ? 'bg-transformer/15 text-transformer'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Transformer · Dense
            </button>
          </div>

          <div className="font-mono text-sm text-muted-foreground">
            <span
              className={sparse ? 'text-synaptic' : 'text-transformer'}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {activeCount}
            </span>
            {' / '}
            {TOTAL} units active
            <span className="ml-2 rounded bg-background px-2 py-0.5 text-xs">
              {activePct}%
            </span>
          </div>
        </div>

        {/* activation grid */}
        <div className="mt-6 rounded-2xl border border-border bg-background p-4 sm:p-6">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {cells.map((v, i) => {
              const active = v < threshold
              // intensity: how strongly this unit fires when active
              const intensity = active ? 0.4 + (1 - v / threshold) * 0.6 : 0
              const color = sparse ? 'var(--synaptic)' : 'var(--transformer)'
              return (
                <div
                  key={i}
                  className="aspect-square rounded-[3px] transition-all duration-300"
                  style={{
                    backgroundColor: active ? color : 'var(--muted)',
                    opacity: active ? intensity : 0.25,
                    boxShadow:
                      active && intensity > 0.8
                        ? `0 0 8px 0 ${color}`
                        : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TradeCard
            active={sparse}
            accent="synaptic"
            title="Why sparsity helps"
            body="Few active units mean writes touch few synapses, keeping updates O(1) and cheap. Non-negative activations also make each firing unit a legible feature."
          />
          <TradeCard
            active={!sparse}
            accent="transformer"
            title="Why dense costs"
            body="Dense feed-forward layers recompute the full matrix every token. Capacity is high, but there is no persistent session state — context lives entirely in the growing KV cache."
          />
        </div>
      </div>
    </section>
  )
}

function TradeCard({
  active,
  accent,
  title,
  body,
}: {
  active: boolean
  accent: 'synaptic' | 'transformer'
  title: string
  body: string
}) {
  const color = accent === 'synaptic' ? 'text-synaptic' : 'text-transformer'
  const ring =
    accent === 'synaptic' ? 'border-synaptic/50' : 'border-transformer/50'
  return (
    <div
      className={`rounded-xl border bg-card/60 p-5 transition-all duration-300 ${
        active ? ring : 'border-border opacity-60'
      }`}
    >
      <p className={`font-mono text-xs uppercase tracking-widest ${color}`}>
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
