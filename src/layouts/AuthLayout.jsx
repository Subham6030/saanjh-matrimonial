import { Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft, Heart, ShieldCheck, Sparkles } from 'lucide-react'
import Logo from '../components/common/Logo'
import ThemeToggle from '../components/common/ThemeToggle'
import SmartImage from '../components/common/SmartImage'
import { siteImages } from '../data/media'
import { brand } from '../data/siteContent'

export default function AuthLayout() {
  const location = useLocation()
  const isRegister = location.pathname.includes('register')

  return (
    <div className="grid min-h-screen bg-bg-primary lg:grid-cols-[1.02fr_1fr]">
      <div className="relative hidden overflow-hidden bg-brand-secondary lg:block">
        <SmartImage
          src={siteImages.story}
          alt="A couple sharing a quiet moment at their wedding"
          loading="eager"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1114]/90 via-[#45181d]/35 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> A demo experience
          </div>
          <div className="max-w-lg">
            <Heart className="mb-5 h-7 w-7 text-[#FFB39C]" aria-hidden="true" />
            <blockquote className="font-display text-3xl leading-tight xl:text-[2.6rem]">
              “The right match should feel less like a search and more like coming home.”
            </blockquote>
            <p className="mt-5 text-sm leading-7 text-white/75">
              Saanjh is a thoughtfully designed matrimonial demo. Every profile, message and
              statistic here is sample content.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            No passwords or payment details are stored in this front-end demo.
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to site
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-card px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {isRegister ? 'Join the demo' : 'Simulated sign in'}
              </div>
            </div>
            <Outlet />
          </div>
        </main>

        <footer className="px-5 py-6 text-center text-[11px] leading-5 text-ink-muted sm:px-8">
          <p>
            © 2026 {brand.name}. Demo authentication only — no real account is created. By
            continuing you accept that all content is simulated.
          </p>
        </footer>
      </div>
    </div>
  )
}
