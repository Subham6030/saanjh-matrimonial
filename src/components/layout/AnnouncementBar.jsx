import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { announcement } from '../../data/siteContent'

const DISMISS_KEY = 'saanjh.announcement.dismissed'

export default function AnnouncementBar() {
  const { settings } = useAdmin()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  if (dismissed || settings?.announcementEnabled === false) return null

  function dismiss() {
    setDismissed(true)
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* no-op */
    }
  }

  return (
    <div className="relative bg-brand-secondary text-bg-primary">
      <div className="container-page flex min-h-9 items-center justify-center gap-3 py-2 pr-10 text-center">
        <p className="text-[11px] font-medium leading-5 sm:text-xs">
          <span className="mr-2 rounded-full bg-bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            Demo
          </span>
          {announcement.text}
        </p>
        <Link
          to={announcement.to}
          className="hidden shrink-0 items-center gap-1 text-[11px] font-semibold underline decoration-bg-primary/40 underline-offset-4 hover:decoration-bg-primary sm:inline-flex"
        >
          {announcement.linkLabel}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-bg-primary/70 transition-colors hover:bg-bg-primary/10 hover:text-bg-primary"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
