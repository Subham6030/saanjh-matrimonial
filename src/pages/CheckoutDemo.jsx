import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CreditCard, Landmark, LockKeyhole, Smartphone, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'
import { addMonths, formatCurrency, formatDate } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSubscription } from '../context/SubscriptionContext'
import { getPlan, monthlyEquivalent, planPrice, yearlySaving } from '../data/plans'
import Button from '../components/common/Button'
import { Alert, Badge, PageHeader } from '../components/common/ui'
import { Select, TextField } from '../components/forms/FormControls'

const paymentMethods = [
  { id: 'card', label: 'Card', icon: CreditCard, note: 'Dummy card details only' },
  { id: 'upi', label: 'UPI', icon: Smartphone, note: 'No request is sent' },
  { id: 'netbanking', label: 'Net banking', icon: Landmark, note: 'No bank connection' },
]

export default function CheckoutDemo() {
  usePageMeta(
    'Demo checkout',
    'A simulated checkout for Saanjh memberships. No payment is taken and no card details are stored.',
  )
  const [searchParams] = useSearchParams()
  const { activatePlan } = useSubscription()

  const planId = searchParams.get('plan') || 'plus'
  const initialInterval = searchParams.get('interval') === 'yearly' ? 'yearly' : 'monthly'
  const plan = getPlan(planId)
  const [interval, setInterval] = useState(initialInterval)
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [upi, setUpi] = useState('')
  const [bank, setBank] = useState('')

  const total = planPrice(plan.id, interval)
  const savings = yearlySaving(plan.id)
  const renews = useMemo(
    () => (total > 0 ? addMonths(interval === 'yearly' ? 12 : 1) : null),
    [interval, total],
  )

  function updateCard(field, value) {
    setCard((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (method === 'card') {
      if (!card.name.trim()) next.name = 'Enter a name for the demo card.'
      const digits = card.number.replace(/\D/g, '')
      if (digits.length < 12) next.number = 'Use at least 12 dummy digits.'
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) next.expiry = 'Use MM/YY.'
      if (!/^\d{3,4}$/.test(card.cvv)) next.cvv = 'Use 3 or 4 dummy digits.'
    }
    if (method === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upi)) {
      next.upi = 'Use a demo UPI ID such as demo@upi.'
    }
    if (method === 'netbanking' && !bank.trim()) next.bank = 'Choose a demo bank.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setProcessing(true)
    window.setTimeout(() => {
      activatePlan(plan.id, interval)
      setProcessing(false)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1300)
  }

  if (plan.id === 'free') {
    return (
      <div>
        <PageHeader eyebrow="Membership" title="No checkout needed" description="The Free plan does not require payment details." />
        <Alert variant="info" title="Free plan selected">
          You can switch to the Free plan directly from the membership page.
        </Alert>
        <Button to="/plans" className="mt-5">
          Back to membership
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl py-6">
        <div className="card-surface p-6 text-center sm:p-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="eyebrow mt-5">Demo complete</p>
          <h1 className="display-page mt-2">Your {plan.name} membership is active</h1>
          <p className="mt-2 text-sm leading-6 text-ink-secondary">
            This was a simulated checkout. No payment was taken, no card details were stored and no
            real subscription was created.
          </p>
          <div className="mt-5 rounded-xl border border-line bg-bg-secondary/50 p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-muted">Plan</span>
              <span className="font-semibold text-ink-primary">{plan.name}</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-ink-muted">Billing</span>
              <span className="font-semibold text-ink-primary">
                {interval === 'yearly' ? 'Yearly' : 'Monthly'} · {formatCurrency(total)}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-ink-muted">Simulated renewal</span>
              <span className="font-semibold text-ink-primary">{renews ? formatDate(renews) : 'None'}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button to="/dashboard">Go to dashboard</Button>
            <Button to="/settings" variant="secondary">
              Manage membership
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Demo checkout"
        title={`Join Saanjh ${plan.name}`}
        description="A fictional checkout to demonstrate the membership journey. Please do not enter real payment details."
        actions={
          <Button to="/plans" variant="ghost" size="sm">
            Change plan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Alert variant="warning" title="This is not a real payment">
            No payment gateway is connected. Use dummy numbers only; nothing is transmitted or
            stored. No charge will ever appear.
          </Alert>

          <div className="card-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink-primary">Billing interval</h2>
                <p className="mt-0.5 text-xs text-ink-secondary">Switch between monthly and yearly in this demo.</p>
              </div>
              {interval === 'yearly' && savings > 0 && (
                <Badge tone="success" size="sm">
                  Save {formatCurrency(savings)}
                </Badge>
              )}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {['monthly', 'yearly'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setInterval(option)}
                  aria-pressed={interval === option}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    interval === option
                      ? 'border-brand bg-brand/5'
                      : 'border-line bg-bg-card hover:border-brand/30',
                  )}
                >
                  <span className="block text-sm font-semibold capitalize text-ink-primary">{option}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {formatCurrency(planPrice(plan.id, option))}
                    {option === 'yearly' ? ' per year' : ' per month'}
                  </span>
                  {option === 'yearly' && (
                    <span className="mt-1 block text-[10px] text-success">
                      {formatCurrency(monthlyEquivalent(plan.id, 'yearly'))} per month equivalent
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-ink-primary">Payment method</h2>
            <p className="mt-0.5 text-xs text-ink-secondary">All methods are display-only simulations.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {paymentMethods.map((item) => {
                const Icon = item.icon
                const active = method === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMethod(item.id)
                      setErrors({})
                    }}
                    aria-pressed={active}
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors',
                      active
                        ? 'border-brand bg-brand/5'
                        : 'border-line bg-bg-card hover:border-brand/30',
                    )}
                  >
                    <Icon className={cn('mt-0.5 h-4 w-4', active ? 'text-brand' : 'text-ink-muted')} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold text-ink-primary">{item.label}</span>
                      <span className="mt-0.5 block text-[10px] leading-4 text-ink-muted">{item.note}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-5" noValidate>
              {method === 'card' && (
                <div className="space-y-4">
                  <TextField
                    label="Name on card"
                    value={card.name}
                    onChange={(event) => updateCard('name', event.target.value)}
                    error={errors.name}
                    placeholder="Demo Member"
                    autoComplete="off"
                  />
                  <TextField
                    label="Card number"
                    value={card.number}
                    onChange={(event) => updateCard('number', event.target.value)}
                    error={errors.number}
                    placeholder="4111 1111 1111 1111"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="Expiry"
                      value={card.expiry}
                      onChange={(event) => updateCard('expiry', event.target.value)}
                      error={errors.expiry}
                      placeholder="MM/YY"
                      autoComplete="off"
                    />
                    <TextField
                      label="CVV"
                      value={card.cvv}
                      onChange={(event) => updateCard('cvv', event.target.value)}
                      error={errors.cvv}
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <TextField
                  label="Demo UPI ID"
                  value={upi}
                  onChange={(event) => {
                    setUpi(event.target.value)
                    setErrors((current) => ({ ...current, upi: '' }))
                  }}
                  error={errors.upi}
                  placeholder="demo@upi"
                  autoComplete="off"
                />
              )}

              {method === 'netbanking' && (
                <div>
                  <label htmlFor="demo-bank" className="label-base">
                    Choose a demo bank
                  </label>
                  <Select
                    id="demo-bank"
                    value={bank}
                    onChange={(event) => {
                      setBank(event.target.value)
                      setErrors((current) => ({ ...current, bank: '' }))
                    }}
                    invalid={Boolean(errors.bank)}
                  >
                    <option value="">Select a bank</option>
                    <option>HDFC Bank (demo)</option>
                    <option>ICICI Bank (demo)</option>
                    <option>State Bank of India (demo)</option>
                    <option>Axis Bank (demo)</option>
                  </Select>
                  {errors.bank && <p className="mt-1.5 text-xs font-medium text-error">{errors.bank}</p>}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Simulated and encrypted nowhere
                </p>
                <Button type="submit" loading={processing} loadingText="Simulating payment…" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Confirm demo payment · {formatCurrency(total)}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink-primary">Order summary</p>
              <Badge tone="brand" size="sm">{plan.name}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-secondary">{plan.tagline}</p>

            <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink-secondary">Plan</span>
                <span className="font-medium text-ink-primary">Saanjh {plan.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink-secondary">Billing</span>
                <span className="font-medium capitalize text-ink-primary">{interval}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink-secondary">Subtotal</span>
                <span className="font-medium text-ink-primary">{formatCurrency(total)}</span>
              </div>
              {interval === 'yearly' && savings > 0 && (
                <div className="flex justify-between gap-3 text-success">
                  <span>Yearly saving</span>
                  <span className="font-medium">− {formatCurrency(savings)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-line pt-3 text-base">
                <span className="font-semibold text-ink-primary">Demo total</span>
                <span className="font-display text-2xl text-ink-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-ink-secondary">
              {plan.highlights.slice(0, 4).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            {renews && (
              <p className="mt-4 border-t border-line pt-3 text-[11px] text-ink-muted">
                Simulated renewal {formatDate(renews)}. Cancel any time in settings.
              </p>
            )}
            <Link to="/plans" className="mt-4 inline-flex text-xs font-semibold text-brand hover:text-brand-hover">
              Compare plans again →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
