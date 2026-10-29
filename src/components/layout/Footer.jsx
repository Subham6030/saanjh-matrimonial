import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { brand, footerLinks, footerNote } from '../../data/siteContent'
import { validateEmail } from '../../utils/validation'
import Logo from '../common/Logo'

export default function Footer() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function subscribe(event) {
    event.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }
    setError('')
    setEmail('')
    toast.success('You are on the demo newsletter list. Nothing was actually sent.', {
      title: 'Simulated subscription',
    })
  }

  return (
    <footer className="border-t border-line bg-bg-secondary/60">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-7 text-ink-secondary">
              A considered matrimonial experience for people who value warmth, honesty and a
              thoughtfully built partnership.
            </p>
            <form onSubmit={subscribe} className="mt-6" noValidate>
              <label htmlFor="footer-email" className="label-base">
                Occasional notes from Saanjh
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="you@example.com"
                    className={`field-base pl-9 ${error ? 'field-error' : ''}`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'footer-email-error' : undefined}
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn-primary px-3.5" aria-label="Subscribe to demo newsletter">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {error && (
                <p id="footer-email-error" className="mt-1.5 text-xs font-medium text-error">
                  {error}
                </p>
              )}
              <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                Demo only — no emails are stored or sent.
              </p>
            </form>
          </div>

          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Support" links={footerLinks.support} />
          <FooterColumn title="Explore" links={footerLinks.explore} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {brand.name} Matrimony. A front-end demonstration.</p>
          <p className="max-w-xl leading-5 sm:text-right">{footerNote}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-ultra-wide text-ink-muted">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-ink-secondary transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
