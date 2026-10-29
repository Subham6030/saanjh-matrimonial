import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Feather,
  HeartHandshake,
  MessagesSquare,
  Quote,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { faqs, howItWorks, testimonials, trustStats, whyChoose } from '../../data/siteContent'
import { getPlan } from '../../data/plans'
import { formatCurrency } from '../../utils/format'
import { siteImages } from '../../data/media'
import Button from '../common/Button'
import SmartImage from '../common/SmartImage'
import { Badge, SectionHeading } from '../common/ui'
import { cn } from '../../utils/cn'

const sectionIcons = { UserRound, Sparkles, MessagesSquare }
const whyIcons = { ShieldCheck, HeartHandshake, Feather, SlidersHorizontal }

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-bg-secondary/45" aria-label="Demo platform statistics">
      <div className="container-page py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="eyebrow">A transparent demo</p>
          <p className="text-[10px] font-medium text-ink-muted">All figures are illustrative sample data</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="border-l border-line pl-4 first:border-l-0 first:pl-0 lg:pl-6">
              <p className="font-display text-3xl text-ink-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-ink-secondary">{stat.label}</p>
              <p className="mt-0.5 text-[10px] text-ink-muted">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="A gentler path from hello to something real."
          description="Three simple steps, designed around intention rather than urgency. Every action here is part of a simulated demo."
          align="center"
          titleClassName="max-w-3xl"
        />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {howItWorks.map((step) => {
            const Icon = sectionIcons[step.icon] || Sparkles
            return (
              <div key={step.id} className="card-surface relative overflow-hidden p-6">
                <span className="absolute right-5 top-4 font-display text-5xl text-brand/10">{step.id}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-secondary">{step.description}</p>
                <Link
                  to={step.to}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover"
                >
                  {step.action}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function WhyChoose() {
  return (
    <section className="bg-bg-secondary/45 py-16 sm:py-20" aria-labelledby="why-saanjh-title">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-2xl border border-line bg-bg-card shadow-soft">
            <SmartImage
              src={siteImages.ceremony}
              alt="A couple at a wedding ceremony — sample imagery"
              className="aspect-[4/3] w-full"
            />
          </div>
          <div className="absolute -bottom-5 -right-2 max-w-[220px] rounded-xl border border-line bg-bg-card p-4 shadow-lift sm:-right-5">
            <p className="eyebrow">Sample story</p>
            <p className="mt-1.5 font-display text-lg leading-snug text-ink-primary">
              “We started with a shared love of old bookshops.”
            </p>
            <p className="mt-2 text-[10px] text-ink-muted">Demo testimonial, not a real couple.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow">Why Saanjh</p>
          <h2 id="why-saanjh-title" className="display-section mt-2.5 max-w-xl">
            Built for the conversation after the first hello.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-secondary sm:text-[15px]">
            Matrimonial search can feel transactional. We have tried to make it feel human: clear
            information, respectful boundaries and no pressure to perform.
          </p>
          <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {whyChoose.map((item) => {
              const Icon = whyIcons[item.icon] || HeartHandshake
              return (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-primary">{item.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-ink-secondary">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PremiumTeaser() {
  const plus = getPlan('plus')
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-brand-secondary px-6 py-10 text-bg-primary sm:px-10 sm:py-12 lg:px-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-bg-primary/15" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full border border-bg-primary/10" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-bg-primary/20 bg-bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-ultra-wide">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> Premium membership
              </span>
              <h2 className="mt-4 max-w-xl font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-tight">
                More room for a considered search.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-bg-primary/75">
                Expanded discovery, deeper compatibility insights and enhanced messaging
                eligibility for members ready to go a little further. No promises, no pressure.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button
                  to="/plans"
                  size="lg"
                  className="!bg-bg-primary !text-brand-secondary hover:!bg-bg-elevated"
                >
                  Explore membership
                </Button>
                <span className="text-[11px] text-bg-primary/65">
                  From {formatCurrency(plus.prices.monthly)}/month · simulated billing
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-bg-primary/15 bg-bg-primary/10 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-ultra-wide text-bg-primary/65">
                Included in Plus
              </p>
              <ul className="mt-3 space-y-2.5">
                {plus.highlights.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-bg-primary/15 pt-3 text-[10px] leading-5 text-bg-primary/60">
                Plan benefits are demo content. Checkout is a simulation; future production billing
                requires a secure payment provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="bg-bg-secondary/45 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Sample stories"
          title="Words from imaginary beginnings."
          description="These are clearly labelled sample testimonials created for the demo. They are not real member stories or endorsements."
          align="center"
        />
        <h2 id="stories-title" className="sr-only">
          Sample testimonials
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure key={item.id} className="card-surface relative flex flex-col p-6">
              <Quote className="h-6 w-6 text-brand/30" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 font-display text-lg leading-relaxed text-ink-primary">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-muted">{item.detail}</p>
                  </div>
                  <Badge tone="warning" size="sm">
                    {index === 0 ? 'Sample' : `Demo ${index + 1}`}
                  </Badge>
                </div>
                <p className="mt-2 text-[10px] text-ink-muted">{item.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-16 sm:py-20" aria-labelledby="faq-title">
      <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div>
          <p className="eyebrow">Questions, answered</p>
          <h2 id="faq-title" className="display-section mt-2.5 max-w-sm">
            A little clarity before you begin.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-ink-secondary">
            Honest answers about what this demo does, what it does not do, and how the simulated
            rules work.
          </p>
          <div className="mt-6 rounded-xl border border-line bg-bg-card p-4">
            <p className="text-xs font-semibold text-ink-primary">Still curious?</p>
            <p className="mt-1 text-xs leading-6 text-ink-secondary">
              The help centre walks through signing in, matching, messaging and resetting the demo.
            </p>
            <Button to="/help" variant="link" size="sm" className="mt-2 px-0">
              Visit the help centre <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-ink-primary transition-colors hover:text-brand"
                  >
                    {faq.question}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300',
                        isOpen && 'rotate-180 text-brand',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  hidden={!isOpen}
                  className="pb-4 pr-8 text-sm leading-7 text-ink-secondary"
                >
                  {faq.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-bg-card px-6 py-10 text-center shadow-soft sm:px-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="display-section max-w-xl">Ready when you are.</h2>
          <p className="max-w-xl text-sm leading-7 text-ink-secondary">
            Create a sample profile, explore the matching experience and see how a calmer
            matrimonial platform could feel.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
            <Button to="/register" size="lg">
              Create your profile
            </Button>
            <Button to="/login" variant="secondary" size="lg">
              Explore with the demo member
            </Button>
          </div>
          <p className="text-[11px] text-ink-muted">
            No real account, no real matches, no payment. Just a thoughtful front-end demo.
          </p>
        </div>
      </div>
    </section>
  )
}
