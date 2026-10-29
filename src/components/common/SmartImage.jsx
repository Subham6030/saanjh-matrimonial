import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

export default function SmartImage({
  src,
  alt = '',
  className,
  imgClassName,
  fallbackLabel,
  loading = 'lazy',
  ...props
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    const label = fallbackLabel || initials(alt || 'Saanjh')
    return (
      <div
        role="img"
        aria-label={alt || 'Image unavailable'}
        className={cn(
          'flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-secondary via-bg-elevated to-brand/10 text-ink-muted',
          className,
        )}
      >
        <span className="font-display text-2xl tracking-tight text-brand/70">{label}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-cover', className, imgClassName)}
      {...props}
    />
  )
}
