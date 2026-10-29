import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'
import SmartImage from './SmartImage'

export function Badge({ children, tone = 'neutral', size = 'md', dot = false, className }) {
  const tones = {
    neutral: 'border-line bg-bg-secondary text-ink-secondary',
    brand: 'border-brand/20 bg-brand/10 text-brand',
    accent: 'border-brand-accent/30 bg-brand-accent/15 text-warning',
    success: 'border-success/25 bg-success/10 text-success',
    warning: 'border-warning/25 bg-warning/10 text-warning',
    error: 'border-error/25 bg-error/10 text-error',
    dark: 'border-transparent bg-ink-primary text-bg-primary',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        tones[tone] || tones.neutral,
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Avatar({ src, name, size = 'md', className, ring = true }) {
  const sizes = {
    xs: 'h-8 w-8 text-[10px]',
    sm: 'h-10 w-10 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
    '2xl': 'h-32 w-32 text-3xl',
  }
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-bg-secondary',
        ring && 'ring-1 ring-line',
        sizes[size] || sizes.md,
        className,
      )}
    >
      <SmartImage
        src={src}
        alt={name ? `${name} profile photo` : 'Profile photo'}
        fallbackLabel={initials(name)}
        className="h-full w-full"
      />
    </span>
  )
}

export function Card({ as: Tag = 'div', hover = false, className, children, ...props }) {
  return (
    <Tag className={cn('card-surface', hover && 'card-hover', className)} {...props}>
      {children}
    </Tag>
  )
}

export function ProgressBar({ value = 0, tone = 'brand', size = 'md', className, label }) {
  const tones = {
    brand: 'bg-brand',
    accent: 'bg-brand-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-bg-secondary', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700', tones[tone] || tones.brand)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function ProgressRing({ value = 0, size = 92, stroke = 7, className }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  return (
    <span className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute font-display text-xl text-ink-primary">{Math.round(value)}%</span>
    </span>
  )
}

export function EmptyState({ icon: Icon, title, description, action, compact = false, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bg-card/60 px-6 text-center',
        compact ? 'py-8' : 'py-14',
        className,
      )}
    >
      {Icon && (
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-lg font-semibold text-ink-primary">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm leading-6 text-ink-secondary">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
  titleClassName,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn(align === 'center' ? 'max-w-2xl' : 'max-w-2xl')}>
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 className={cn('display-section text-ink-primary', titleClassName)}>{title}</h2>
        {description && (
          <p className={cn('mt-3 text-sm leading-7 text-ink-secondary sm:text-[15px]', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions, className, children }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:mb-8', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h1 className="display-page text-ink-primary">{title}</h1>
          {description && <p className="mt-2 text-sm leading-6 text-ink-secondary">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, helper, tone = 'brand', to, className }) {
  const tones = {
    brand: 'bg-brand/10 text-brand',
    accent: 'bg-brand-accent/15 text-warning',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    neutral: 'bg-bg-secondary text-ink-secondary',
  }
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink-primary">{value}</p>
        </div>
        {Icon && (
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {helper && <p className="mt-3 text-xs leading-5 text-ink-muted">{helper}</p>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cn('card-surface card-hover block p-5', className)}>
        {content}
      </Link>
    )
  }
  return <div className={cn('card-surface p-5', className)}>{content}</div>
}

const alertTones = {
  info: { wrap: 'border-line bg-bg-secondary/70 text-ink-primary', icon: 'text-brand', Icon: Info },
  success: { wrap: 'border-success/25 bg-success/10 text-ink-primary', icon: 'text-success', Icon: CheckCircle2 },
  warning: { wrap: 'border-warning/25 bg-warning/10 text-ink-primary', icon: 'text-warning', Icon: TriangleAlert },
  error: { wrap: 'border-error/25 bg-error/10 text-ink-primary', icon: 'text-error', Icon: AlertCircle },
}

export function Alert({ variant = 'info', title, children, className, actions }) {
  const tone = alertTones[variant] || alertTones.info
  const Icon = tone.Icon
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3.5', tone.wrap, className)}>
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone.icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className={cn('text-sm leading-6 text-ink-secondary', title && 'mt-0.5')}>{children}</div>
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-ink-secondary', className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}

export function Tabs({ tabs, value, onChange, ariaLabel = 'Tabs', className }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex items-center gap-1 overflow-x-auto rounded-xl border border-line bg-bg-card p-1 hide-scrollbar', className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm',
              active
                ? 'bg-brand text-white shadow-soft'
                : 'text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary',
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  active ? 'bg-white/20 text-white' : 'bg-bg-secondary text-ink-muted',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  return (
    <nav className={cn('flex items-center justify-between gap-3', className)} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-secondary px-3 py-2 text-xs disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
      </button>
      <div className="flex items-center gap-1">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
              item === page
                ? 'bg-brand text-white'
                : 'text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary',
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-secondary px-3 py-2 text-xs disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

export function DemoBadge({ className, label = 'Demo' }) {
  return (
    <Badge tone="warning" size="sm" className={cn('uppercase tracking-wider', className)}>
      {label}
    </Badge>
  )
}
