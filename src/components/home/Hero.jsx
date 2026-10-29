import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Star } from 'lucide-react'
import Button from '../common/Button'
import SmartImage from '../common/SmartImage'
import CompatibilityPill from '../profiles/CompatibilityPill'
import { Avatar } from '../common/ui'
import { featuredProfiles } from '../../data/profiles'
import { siteImages } from '../../data/media'

export default function Hero() {
  const faces = featuredProfiles.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-hero-wash">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full border border-brand/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full border border-brand-accent/20" aria-hidden="true" />

      <div className="container-page grid items-center gap-12 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16 lg:py-20">
        <div className="relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-card px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            Intentional matchmaking · Demo experience
          </div>

          <h1 className="display-hero mt-6 max-w-[13ch] text-ink-primary">
            Your story begins with the{' '}
            <span className="serif-accent text-brand">right match.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-secondary sm:text-base sm:leading-8">
            A warmer, more considered way to meet someone who shares your values. Explore sample
            profiles, understand the compatibility signals, and take your time. No noise, no
            pressure — just thoughtful introductions.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Button to="/matches" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Find your match
            </Button>
            <Button to="/register" size="lg" variant="secondary">
              Create your profile
            </Button>
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {faces.map((profile) => (
                  <Avatar
                    key={profile.id}
                    src={profile.primaryPhoto}
                    name={profile.displayName}
                    size="xs"
                    className="ring-2 ring-bg-primary"
                  />
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-primary">24 curated sample profiles</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">Fictional people, realistic detail</p>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            <div className="flex items-center gap-2 text-[11px] text-ink-secondary">
              <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              Consent-first profile visibility
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px] animate-fade-up [animation-delay:120ms]">
          <div className="absolute -left-2 -top-2 z-10 h-20 w-20 rounded-tl-[28px] border-l-2 border-t-2 border-brand/30" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-bg-secondary shadow-float">
            <SmartImage
              src={siteImages.hero}
              alt="A couple sharing a warm moment at their wedding celebration"
              loading="eager"
              className="aspect-[4/5] w-full sm:aspect-[5/6]"
              imgClassName="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f1417]/75 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-bg-card/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-ultra-wide text-ink-secondary shadow-soft">
              Demo story
            </div>
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="serif-accent text-xl leading-snug sm:text-2xl">
                “Some stories begin quietly, over a shared love of chai.”
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-ultra-wide text-white/60">
                Sample content · not a real couple
              </p>
            </div>
          </div>

          <div className="absolute -left-6 bottom-24 hidden w-[210px] rounded-2xl border border-line bg-bg-card p-3.5 shadow-lift sm:block">
            <div className="flex items-center gap-2.5">
              <Avatar src={featuredProfiles[0]?.primaryPhoto} name={featuredProfiles[0]?.displayName} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink-primary">
                  {featuredProfiles[0]?.firstName}, {featuredProfiles[0]?.age}
                </p>
                <p className="truncate text-[10px] text-ink-muted">{featuredProfiles[0]?.city}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <CompatibilityPill score={92} size="sm" />
              <HeartHandshake className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-ink-muted">
              Sample compatibility, not a prediction.
            </p>
          </div>

          <div className="absolute -right-3 top-16 hidden items-center gap-2 rounded-full border border-line bg-bg-card px-3 py-2 shadow-soft sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold text-ink-secondary">12 compatibility signals</span>
          </div>
        </div>
      </div>

      <div className="container-page relative z-10 pb-10 lg:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg-card/80 px-4 py-3 text-[11px] text-ink-muted shadow-soft sm:px-5">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            No real members. No real messages. All data is demo-only.
          </p>
          <Link to="/help" className="font-semibold text-brand hover:text-brand-hover">
            How the demo works →
          </Link>
        </div>
      </div>
    </section>
  )
}
