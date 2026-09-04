import { EssayHeader } from '@/components/essay-header'
import { MemoryScaling } from '@/components/memory-scaling'
import { ActivationToggle } from '@/components/activation-toggle'
import { BdhModule } from '@/components/bdh-module'

export default function Page() {
  return (
    <main className="min-h-dvh">
      <EssayHeader />
      <MemoryScaling />
      <ActivationToggle />
      <BdhModule />

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-muted-foreground">
            Pathway BDH · DataForge 2026 Education Track
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            O(1) synaptic memory · sparse activations · bounded capacity
          </p>
        </div>
      </footer>
    </main>
  )
}
