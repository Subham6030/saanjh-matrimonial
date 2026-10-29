import { Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { brand } from '../../data/siteContent'
import { cn } from '../../utils/cn'

const sizes = {
  sm: { mark: 'h-8 w-8 rounded-lg text-sm', name: 'text-xl', descriptor: 'text-[8px]' },
  md: { mark: 'h-10 w-10 rounded-xl text-lg', name: 'text-2xl', descriptor: 'text-[9px]' },
  lg: { mark: 'h-12 w-12 rounded-2xl text-2xl', name: 'text-3xl', descriptor: 'text-[10px]' },
}

export default function Logo({ to = '/', size = 'md', showDescriptor = true, className }) {
  const { settings } = useAdmin()
  const name = settings?.brandName || brand.name
  const scale = sizes[size] || sizes.md

  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label={`${name} — home`}
    >
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center bg-brand font-display text-white shadow-[0_8px_20px_-12px_rgba(231,71,50,0.9)] transition-transform duration-300 group-hover:-rotate-3',
          scale.mark,
        )}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-accent ring-2 ring-bg-primary" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display tracking-tight text-ink-primary', scale.name)}>{name}</span>
        {showDescriptor && (
          <span
            className={cn(
              'mt-1 font-semibold uppercase tracking-ultra-wide text-ink-muted',
              scale.descriptor,
            )}
          >
            Matrimony
          </span>
        )}
      </span>
    </Link>
  )
}
