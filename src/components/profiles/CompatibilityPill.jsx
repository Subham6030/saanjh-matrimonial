import { Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function CompatibilityPill({ score, className, label = 'sample fit', size = 'md' }) {
  if (score === undefined || score === null) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-bg-card/95 font-semibold text-ink-primary shadow-soft backdrop-blur-sm',
        size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]',
        className,
      )}
      title="Sample compatibility score — not a scientific prediction"
    >
      <Sparkles className="h-3 w-3 text-brand" aria-hidden="true" />
      <span className="font-bold text-brand">{score}%</span>
      <span className="font-medium text-ink-secondary">{label}</span>
    </span>
  )
}
