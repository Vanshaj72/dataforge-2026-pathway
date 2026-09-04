'use client'

import { useState } from 'react'
import { SectionLabel } from './memory-scaling'

export function BdhModule() {
  return (
    <section id="bdh" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-16 sm:px-8">
      <SectionLabel index="03" title="Pathway BDH Module" />
      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
        BDH (Baby Dragon Hatchling) reframes the Transformer&apos;s attention as
        a biologically-styled synaptic memory: local Hebbian writes on a
        fixed-size, scale-free connectivity graph.
      </p>

      <div className="mt-8 grid gap-6">
        <AttentionReformulation />
        <div className="grid gap-6 lg:grid-cols-2">
          <ScaleFreeConnectivity />
          <StateInterference />
        </div>
      </div>
    </section>
  )
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-synaptic">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function AttentionReformulation() {
  return (
    <Panel
      eyebrow="Mechanism"
      title="Attention → synaptic memory updates"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Standard attention re-scans every cached key/value pair for each new
            token. BDH instead <span className="text-foreground">writes</span>{' '}
            associations into a synaptic state matrix{' '}
            <span className="font-mono text-synaptic">S</span>, then{' '}
            <span className="text-foreground">reads</span> them back by
            projection — no growing cache, and each write is local and additive.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-synaptic">›</span> Write is Hebbian: units
              that fire together strengthen their shared synapse.
            </li>
            <li className="flex gap-2">
              <span className="text-synaptic">›</span> State size is fixed by the
              neuron count, not the sequence length.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 font-mono text-sm">
          <EqRow
            tag="Transformer"
            accent="transformer"
            expr="y = softmax(Q Kᵀ) · V"
            note="reads over N cached (K,V) — O(N)"
          />
          <EqRow
            tag="BDH write"
            accent="synaptic"
            expr="S ← S + η · ( φ(x) ⊗ ρ(x) )"
            note="rank-1 Hebbian update — O(1)"
          />
          <EqRow
            tag="BDH read"
            accent="synaptic"
            expr="y = S · φ(x)"
            note="associative recall from state"
          />
        </div>
      </div>
    </Panel>
  )
}

function EqRow({
  tag,
  expr,
  note,
  accent,
}: {
  tag: string
  expr: string
  note: string
  accent: 'synaptic' | 'transformer'
}) {
  const color = accent === 'synaptic' ? 'text-synaptic' : 'text-transformer'
  const border =
    accent === 'synaptic' ? 'border-synaptic/30' : 'border-transformer/30'
  return (
    <div className={`rounded-lg border ${border} bg-background/60 p-3`}>
      <p className={`text-[0.6rem] uppercase tracking-widest ${color}`}>{tag}</p>
      <p className="mt-1 text-foreground">{expr}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

function ScaleFreeConnectivity() {
  // power-law-ish sample: a few hub neurons, a long tail of sparse ones
  const bars = [98, 61, 40, 27, 19, 14, 10, 8, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1]
  const max = bars[0]
  return (
    <Panel
      eyebrow="Topology"
      title="Scale-free, heavy-tailed connectivity"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Synapses are not uniform. A few <span className="text-synaptic">hub</span>{' '}
        neurons hold most connections while the long tail stays sparse — a
        power-law degree distribution that keeps updates cheap and routing
        efficient.
      </p>
      <div className="mt-5 flex h-32 items-end gap-1" aria-hidden="true">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${(b / max) * 100}%`,
              backgroundColor: 'var(--synaptic)',
              opacity: 0.35 + (b / max) * 0.65,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-muted-foreground">
        <span>hub neurons</span>
        <span>long tail →</span>
      </div>
    </Panel>
  )
}

function StateInterference() {
  const [load, setLoad] = useState(35)
  // recall accuracy degrades as stored associations exceed capacity
  const capacity = 45 // % load where interference sets in
  const recall =
    load <= capacity
      ? 99 - (load / capacity) * 8
      : Math.max(24, 91 - (load - capacity) * 1.35)
  const stressed = load > capacity

  return (
    <Panel eyebrow="Limits" title="Trade-offs & state interference">
      <p className="text-sm leading-relaxed text-muted-foreground">
        The fixed matrix is finite. Past its capacity, new Hebbian writes
        overwrite older associations — recall degrades as memories{' '}
        <span className="text-transformer">interfere</span>.
      </p>

      <div className="mt-5 flex items-baseline justify-between">
        <label
          htmlFor="mem-load"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          Memory Load
        </label>
        <span
          className={`font-mono text-sm ${
            stressed ? 'text-transformer' : 'text-synaptic'
          }`}
        >
          {load}% stored
        </span>
      </div>
      <input
        id="mem-load"
        type="range"
        min={0}
        max={100}
        value={load}
        onChange={(e) => setLoad(Number(e.target.value))}
        className="mt-3 w-full cursor-pointer"
        style={{ accentColor: stressed ? 'var(--transformer)' : 'var(--synaptic)' }}
      />

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Recall accuracy</span>
          <span
            className={`font-mono text-2xl font-semibold tabular-nums ${
              stressed ? 'text-transformer' : 'text-synaptic'
            }`}
          >
            {recall.toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${recall}%`,
              backgroundColor: stressed
                ? 'var(--transformer)'
                : 'var(--synaptic)',
            }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {stressed
            ? 'High load: associative interference is corrupting stored memories.'
            : 'Within capacity: writes are clean and recall stays near-perfect.'}
        </p>
      </div>
    </Panel>
  )
}
