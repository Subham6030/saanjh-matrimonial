import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import SmartImage from '../common/SmartImage'

export default function ProfileGallery({ photos = [], name, verified }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [name])

  if (!photos.length) {
    return (
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bg-secondary/60 text-ink-muted">
        <ImageOff className="h-7 w-7" aria-hidden="true" />
        <p className="mt-2 text-sm">No profile photos yet</p>
      </div>
    )
  }

  const safeIndex = Math.min(active, photos.length - 1)

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-secondary">
        <SmartImage
          src={photos[safeIndex]}
          alt={`${name} — sample profile photo ${safeIndex + 1} of ${photos.length}`}
          loading="eager"
          className="aspect-[4/5] w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-primary/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-bg-card/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink-secondary shadow-soft">
            Sample profile
          </span>
          {verified && (
            <span className="rounded-full bg-bg-card/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-success shadow-soft">
              Demo verified
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-ink-primary/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          {safeIndex + 1} / {photos.length}
        </span>
      </div>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Profile photo gallery">
          {photos.map((photo, index) => (
            <button
              key={`${photo.slice(0, 40)}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show profile photo ${index + 1}`}
              aria-current={index === safeIndex ? 'true' : undefined}
              className={cn(
                'overflow-hidden rounded-xl border-2 transition-colors',
                index === safeIndex ? 'border-brand' : 'border-transparent hover:border-brand/40',
              )}
            >
              <SmartImage
                src={photo}
                alt=""
                className="aspect-[4/3] w-full"
                imgClassName="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
