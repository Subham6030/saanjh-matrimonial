import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Heart, Search } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import Button from '../components/common/Button'

export default function NotFound() {
  usePageMeta('Page not found', 'This page could not be found in the Saanjh matrimonial demo.')

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-line bg-bg-card">
          <Compass className="h-10 w-10 text-brand" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-soft">
            404
          </span>
          <Heart
            className="absolute -bottom-1 -left-2 h-6 w-6 fill-brand/10 text-brand/40"
            aria-hidden="true"
          />
        </div>
        <p className="eyebrow mb-2">A small detour</p>
        <h1 className="display-section text-ink-primary">This page is not part of the story.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-secondary">
          The link may be incomplete, or the page may have moved. Let us take you back to a place
          where the introductions begin.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Button to="/" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back home
          </Button>
          <Button to="/matches" variant="secondary" leftIcon={<Search className="h-4 w-4" />}>
            Browse matches
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ink-muted">
          <Link to="/about" className="hover:text-brand">About Saanjh</Link>
          <span aria-hidden="true">·</span>
          <Link to="/help" className="hover:text-brand">Help centre</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact" className="hover:text-brand">Contact</Link>
        </div>
      </div>
    </section>
  )
}
