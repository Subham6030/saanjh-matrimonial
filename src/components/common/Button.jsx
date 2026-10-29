import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  soft: 'btn-soft',
  danger: 'btn-danger',
  link: 'inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-[15px]',
  xl: 'px-7 py-3.5 text-sm sm:text-base',
  none: '',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled = false,
  type = 'button',
  ...props
}) {
  const classes = cn(
    variants[variant] || variants.primary,
    variant !== 'link' && (sizes[size] || sizes.md),
    fullWidth && 'w-full',
    className,
  )
  const isDisabled = disabled || loading
  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{loading && loadingText ? loadingText : children}</span>
      {!loading && rightIcon}
    </>
  )

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classes} aria-busy={loading || undefined} {...props}>
        {content}
      </Link>
    )
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={classes} rel="noreferrer" {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...props}>
      {content}
    </button>
  )
}
