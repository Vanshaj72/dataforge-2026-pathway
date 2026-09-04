'use client'

import { useMemo, useState } from 'react'

// Representative Transformer: 2(K+V) * 32 layers * 4096 d_model * 2 bytes (fp16)
// = 0.5 MB of KV cache per token.
const KV_MB_PER_TOKEN = 0.5
// BDH keeps a fixed-size synaptic matrix (session memory) regardless of length.
const SYNAPTIC_CONST_MB = 320
const CROSSOVER_TOKENS = Math.round(SYNAPTIC_CONST_MB / KV_MB_PER_TOKEN) // 640

const PRESETS = [100, 1000, 4000, 10000]

function formatMB(mb: number) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
  return `${Math.round(mb)} MB`
}

export function MemoryScaling() {
  const [length, setLength] = useState(2000)

  const kvTotal = length * KV_MB_PER_TOKEN
  const yMax = Math.max(kvTotal, SYNAPTIC_CONST_MB) * 1.12
  const ratio = kvTotal / SYNAPTIC_CONST_MB

  // SVG geometry
  const W = 820
  const H = 360
  const P = { top: 24, right: 24, bottom: 40, left: 60 }
  const plotW = W - P.left - P.right
  const plotH = H - P.top - P.bottom

  const x = (n: number) => P.left + (n / length) * plotW
  const y = (mb: number) => P.top + plotH - (mb / yMax) * plotH

  const kvLine = `M ${x(0)} ${y(0)} L ${x(length)} ${y(kvTotal)}`
  const kvArea = `${kvLine} L ${x(length)} ${y(0)} L ${x(0)} ${y(0)} Z`
  const synLine = `M ${x(0)} ${y(SYNAPTIC_CONST_MB)} L ${x(length)} ${y(
    SYNAPTIC_CONST_MB,
  )}`

  const showCrossover = length >= CROSSOVER_TOKENS

  const yTicks = useMemo(() => {
    const ticks = []
    for (let i = 0; i <= 4; i++) ticks.push((yMax / 4) * i)
    return ticks
  }, [yMax])

  return (
    <section
      id="scaling"
      className="mx-auto max-w-5xl scroll-mt-6 px-5 py-16 sm:px-8"
    >
      <SectionLabel index="01" title="Memory Growth Under Load" />
      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
        Drag the sequence length. The Transformer&apos;s KV cache grows{' '}
        <span className="font-mono text-transformer">linearly O(N)</span> with
        every token retained, while BDH folds each token into a fixed-size
        synaptic matrix that stays{' '}
        <span className="font-mono text-synaptic">constant O(1)</span>.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur sm:p-6">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Memory usage chart at ${length} tokens: KV cache ${formatMB(
              kvTotal,
            )}, synaptic memory ${formatMB(SYNAPTIC_CONST_MB)}`}
          >
            {/* gridlines + y labels */}
            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={P.left}
                  x2={W - P.right}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="var(--grid-line)"
                  strokeWidth={1}
                />
                <text
                  x={P.left - 10}
                  y={y(t) + 4}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono"
                  fontSize={11}
                >
                  {formatMB(t)}
                </text>
              </g>
            ))}

            {/* x axis labels */}
            <text
              x={P.left}
              y={H - 12}
              textAnchor="start"
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              0
            </text>
            <text
              x={W - P.right}
              y={H - 12}
              textAnchor="end"
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              {length.toLocaleString()} tokens
            </text>

            {/* KV area + line */}
            <path d={kvArea} fill="var(--transformer)" opacity={0.12} />
            <path
              d={kvLine}
              fill="none"
              stroke="var(--transformer)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Synaptic line */}
            <path
              d={synLine}
              fill="none"
              stroke="var(--synaptic)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="2 7"
            />

            {/* crossover marker */}
            {showCrossover && (
              <g>
                <line
                  x1={x(CROSSOVER_TOKENS)}
                  x2={x(CROSSOVER_TOKENS)}
                  y1={P.top}
                  y2={P.top + plotH}
                  stroke="var(--foreground)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  opacity={0.3}
                />
                <circle
                  cx={x(CROSSOVER_TOKENS)}
                  cy={y(SYNAPTIC_CONST_MB)}
                  r={4}
                  className="fill-foreground"
                />
              </g>
            )}

            {/* current endpoints */}
            <circle
              cx={x(length)}
              cy={y(kvTotal)}
              r={5}
              fill="var(--transformer)"
            />
            <circle
              cx={x(length)}
              cy={y(SYNAPTIC_CONST_MB)}
              r={5}
              fill="var(--synaptic)"
            />
          </svg>
        </div>

        {/* readouts */}
        <div className="flex flex-col gap-4">
          <Readout
            label="KV Cache — O(N)"
            value={formatMB(kvTotal)}
            accent="transformer"
            sub={`${length.toLocaleString()} × 0.5 MB/token`}
          />
          <Readout
            label="Synaptic — O(1)"
            value={formatMB(SYNAPTIC_CONST_MB)}
            accent="synaptic"
            sub="fixed session matrix"
          />
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              KV / Synaptic
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {ratio < 1 ? ratio.toFixed(2) : ratio.toFixed(1)}×
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {showCrossover
                ? `KV cache overtook the synaptic footprint at ~${CROSSOVER_TOKENS} tokens.`
                : `Below ~${CROSSOVER_TOKENS} tokens the fixed matrix still dominates.`}
            </p>
          </div>
        </div>
      </div>

      {/* slider control */}
      <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor="seq-length"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Sequence Length
          </label>
          <span className="font-mono text-2xl font-semibold text-synaptic tabular-nums">
            {length.toLocaleString()}
            <span className="ml-1 text-sm text-muted-foreground">tokens</span>
          </span>
        </div>
        <input
          id="seq-length"
          type="range"
          min={100}
          max={10000}
          step={100}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="mt-4 w-full cursor-pointer accent-synaptic"
          style={{ accentColor: 'var(--synaptic)' }}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setLength(p)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                length === p
                  ? 'border-synaptic bg-synaptic/15 text-synaptic'
                  : 'border-border text-muted-foreground hover:border-synaptic/50 hover:text-foreground'
              }`}
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Readout({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent: 'synaptic' | 'transformer'
}) {
  const color = accent === 'synaptic' ? 'text-synaptic' : 'text-transformer'
  const border =
    accent === 'synaptic' ? 'border-synaptic/30' : 'border-transformer/30'
  return (
    <div className={`rounded-xl border ${border} bg-card/60 p-4`}>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${color}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

export function SectionLabel({
  index,
  title,
}: {
  index: string
  title: string
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-sm text-synaptic">{index}</span>
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
