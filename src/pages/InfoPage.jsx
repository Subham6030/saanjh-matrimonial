import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { brand, faqs, infoPages } from '../data/siteContent'
import { EMAIL_PATTERN } from '../utils/validation'
import { usePageMeta } from '../hooks/usePageMeta'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import { Alert, Badge } from '../components/common/ui'
import { SelectField, TextField, TextareaField } from '../components/forms/FormControls'

const infoLinks = ['about', 'contact', 'help', 'privacy', 'terms']

const safetyTips = [
  'Never share financial details, identity documents or passwords with a match.',
  'Meet for the first time in a public place and tell someone you trust where you are going.',
  'Take your time. A genuine connection will respect your pace and boundaries.',
  'Use the report control on any sample profile that feels inappropriate.',
]

function ContactForm() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', topic: 'Demo question', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setSent(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'A little more detail helps (10+ characters).'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setLoading(false)
    setSent(true)
    toast.success('Your simulated message was recorded. Nothing was actually sent.', {
      title: 'Demo form submitted',
    })
    setForm({ name: '', email: '', topic: 'Demo question', message: '' })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-surface p-5 sm:p-6">
      <h2 className="font-display text-2xl text-ink-primary">Send a note</h2>
      <p className="mt-1 text-sm leading-6 text-ink-secondary">
        This form is for demonstration only. No message leaves your browser.
      </p>
      {sent && (
        <Alert variant="success" title="Thank you" className="mt-5">
          The interaction was validated and simulated successfully. In a production build, this would
          reach the support team.
        </Alert>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          label="Your name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <SelectField
          label="What is this about?"
          value={form.topic}
          onChange={(event) => update('topic', event.target.value)}
          className="sm:col-span-2"
        >
          {['Demo question', 'Design feedback', 'Production enquiry', 'Something else'].map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </SelectField>
        <TextareaField
          label="Message"
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          error={errors.message}
          hint="Please do not include sensitive personal information."
          className="sm:col-span-2"
          rows={5}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-ink-muted">Demo form · no data is transmitted</p>
        <Button type="submit" loading={loading} loadingText="Sending">
          Send demo message
        </Button>
      </div>
    </form>
  )
}

function SafetySection() {
  return (
    <section id="safety" className="scroll-mt-28">
      <div className="card-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-ink-primary">Safety, before anything else</h2>
            <p className="mt-1 text-sm leading-6 text-ink-secondary">
              These are general relationship-safety reminders. They do not describe a live safety
              service.
            </p>
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {safetyTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm leading-6 text-ink-secondary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function InfoPage({ page = 'about' }) {
  const content = infoPages[page] || infoPages.about
  usePageMeta(content.eyebrow, content.intro)

  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link to="/" className="hover:text-brand">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-secondary">{content.eyebrow}</span>
      </nav>

      <div className="max-w-3xl">
        <p className="eyebrow mb-3">{content.eyebrow}</p>
        <h1 className="display-hero text-ink-primary">{content.title}</h1>
        <p className="mt-4 text-base leading-8 text-ink-secondary sm:text-lg">{content.intro}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Saanjh information
          </p>
          <nav className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar lg:flex-col" aria-label="Information pages">
            {infoLinks.map((key) => (
              <Link
                key={key}
                to={`/${key}`}
                className={
                  key === page
                    ? 'shrink-0 rounded-lg bg-brand/10 px-3 py-2 text-xs font-semibold text-brand'
                    : 'shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary'
                }
              >
                {infoPages[key].eyebrow}
              </Link>
            ))}
          </nav>
          <div className="mt-5 hidden rounded-xl border border-line bg-bg-secondary/40 p-4 lg:block">
            <p className="text-xs font-semibold text-ink-primary">Need a human?</p>
            <p className="mt-1 text-[11px] leading-5 text-ink-muted">
              This is a demo, but the contact form shows how support would work.
            </p>
            <Button to="/contact" variant="link" size="sm" className="mt-2 px-0">
              Contact us <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          {page === 'contact' && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Mail, label: 'Email', value: brand.supportEmail, href: `mailto:${brand.supportEmail}` },
                  { icon: Phone, label: 'Phone', value: brand.phone, href: '#' },
                  { icon: MapPin, label: 'Studio', value: brand.location, href: null },
                ].map((item) => {
                  const Icon = item.icon
                  const body = (
                    <>
                      <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{item.label}</span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-ink-primary">{item.value}</span>
                    </>
                  )
                  return item.href ? (
                    <a key={item.label} href={item.href} className="card-surface card-hover block p-4">
                      {body}
                    </a>
                  ) : (
                    <div key={item.label} className="card-surface p-4">{body}</div>
                  )
                })}
              </div>
              <Alert variant="warning" title="Simulated contact details">
                The email address, phone number and studio location above are placeholders. Do not use
                them to contact a real business.
              </Alert>
            </>
          )}

          {content.sections.map((section, index) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="scroll-mt-28"
            >
              <div className="card-surface p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="font-display text-2xl text-brand/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl text-ink-primary">{section.heading}</h2>
                    <p className="mt-2 text-sm leading-7 text-ink-secondary">{section.body}</p>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {page === 'contact' && <ContactForm />}

          {page === 'help' && (
            <>
              <section className="card-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-ink-primary">Common questions</h2>
                    <p className="mt-1 text-sm text-ink-secondary">Honest answers about this demonstration.</p>
                  </div>
                  <Badge tone="neutral" size="sm">Demo FAQ</Badge>
                </div>
                <div className="mt-5 divide-y divide-line">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group py-3 first:pt-0 last:pb-0">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink-primary">
                        {faq.question}
                        <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-secondary">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
              <SafetySection />
            </>
          )}

          {page === 'about' && (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, label: '24', value: 'sample profiles' },
                { icon: Sparkles, label: '12', value: 'compatibility signals' },
                { icon: Clock, label: '100%', value: 'front-end demo' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.value} className="rounded-xl border border-line bg-bg-card p-4">
                    <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                    <p className="mt-3 font-display text-2xl text-ink-primary">{stat.label}</p>
                    <p className="mt-0.5 text-[11px] text-ink-muted">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          )}

          {page !== 'help' && page !== 'contact' && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg-secondary/40 px-5 py-4">
              <div className="flex items-center gap-2 text-xs text-ink-secondary">
                <MessageCircle className="h-4 w-4 text-brand" aria-hidden="true" />
                Questions about this demo?
              </div>
              <div className="flex flex-wrap gap-2">
                <Button to="/help" variant="secondary" size="sm">Help centre</Button>
                <Button to="/contact" size="sm">Contact</Button>
              </div>
            </div>
          )}

          <div className="border-t border-line pt-5 text-[11px] leading-5 text-ink-muted">
            {brand.wordmark} is a front-end demonstration. This page is sample content and does not
            describe a live service. Questions?{' '}
            <a href={`mailto:${brand.supportEmail}`} className="font-medium text-brand hover:underline">
              {brand.supportEmail}
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
