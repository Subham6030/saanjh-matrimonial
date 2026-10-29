import { useState } from 'react'
import { Check, Crown, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'
import { formatCurrency, formatDate } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSubscription } from '../context/SubscriptionContext'
import { useToast } from '../context/ToastContext'
import { featureGroups, monthlyEquivalent, plans, yearlySaving } from '../data/plans'
import Button from '../components/common/Button'
import { Alert, Badge, PageHeader } from '../components/common/ui'

function planPriceLabel(plan, interval) {
  const price = plan.prices[interval]
  if (price === 0) return 'Free'
  return formatCurrency(price)
}

export default function SubscriptionPlans() {
  usePageMeta(
    'Membership plans',
    'Compare Saanjh Free, Plus and Premium memberships. All prices, upgrades and payments are simulated.',
  )
  const { subscription, plan: currentPlan, activatePlan } = useSubscription()
  const toast = useToast()
  const [interval, setInterval] = useState(subscription.interval || 'monthly')

  const currentActive = subscription.status === 'active'

  function switchToFree() {
    activatePlan('free', 'monthly')
    toast.success('Your demo membership is now on the Free plan. No payment was involved.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Membership"
        title="Choose the pace of your search"
        description="Every plan here is fictional and every payment flow is simulated. Compare the demo experience and switch at any time."
        actions={
          <Badge tone={currentActive ? 'success' : 'warning'} size="sm">
            <Crown className="h-3 w-3" aria-hidden="true" /> Current: {currentPlan.name}
          </Badge>
        }
      />

      <div className="card-surface mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Crown className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-primary">
              {currentPlan.name} membership ·{' '}
              <span className={currentActive ? 'text-success' : 'text-warning'}>
                {subscription.status === 'active' ? 'Active' : subscription.status}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-ink-secondary">
              {subscription.renewsAt
                ? `Next simulated renewal ${formatDate(subscription.renewsAt)} · ${subscription.interval} billing`
                : 'No renewal required on the Free plan.'}
            </p>
          </div>
        </div>
        <Button to="/settings" variant="secondary" size="sm">
          Manage membership
        </Button>
      </div>

      <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div
          className="inline-flex rounded-full border border-line bg-bg-card p-1"
          role="group"
          aria-label="Billing interval"
        >
          {[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={interval === option.value}
              onClick={() => setInterval(option.value)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                interval === option.value
                  ? 'bg-brand text-white shadow-soft'
                  : 'text-ink-secondary hover:text-ink-primary',
              )}
            >
              {option.label}
              {option.value === 'yearly' && (
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                    interval === 'yearly' ? 'bg-white/20 text-white' : 'bg-success/10 text-success',
                  )}
                >
                  Save
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-muted">
          {interval === 'yearly'
            ? 'Yearly billing saves you two months on paid plans in this demo.'
            : 'Switch to yearly billing to see the demo saving.'}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((item) => {
          const isCurrent = item.id === subscription.planId && currentActive
          const isCancelledCurrent = item.id === subscription.planId && !currentActive
          const saving = yearlySaving(item.id)
          const monthly = monthlyEquivalent(item.id, interval)
          return (
            <div
              key={item.id}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-bg-card p-5 sm:p-6',
                item.recommended
                  ? 'border-brand/40 shadow-lift ring-1 ring-brand/10'
                  : 'border-line',
                isCurrent && 'border-success/40',
              )}
            >
              {item.recommended && (
                <span className="absolute -top-3 left-5 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {item.badge}
                </span>
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl text-ink-primary">{item.name}</h2>
                  <p className="mt-1 text-xs font-medium text-ink-secondary">{item.tagline}</p>
                </div>
                {isCurrent && (
                  <Badge tone="success" size="sm">
                    <Check className="h-3 w-3" aria-hidden="true" /> Current
                  </Badge>
                )}
              </div>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-ink-primary">
                  {planPriceLabel(item, interval)}
                </span>
                {item.prices[interval] > 0 && (
                  <span className="text-xs text-ink-muted">/{interval === 'yearly' ? 'year' : 'month'}</span>
                )}
              </div>
              <p className="mt-1 min-h-[20px] text-[11px] text-ink-muted">
                {item.prices[interval] > 0 && interval === 'yearly'
                  ? `${formatCurrency(monthly)} per month, billed yearly · save ${formatCurrency(saving)}`
                  : item.prices[interval] > 0
                    ? 'Billed monthly in this simulation'
                    : 'A thoughtful way to begin'}
              </p>

              <p className="mt-4 text-sm leading-6 text-ink-secondary">{item.description}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-ink-secondary">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <Button fullWidth variant="secondary" disabled leftIcon={<Check className="h-4 w-4" />}>
                    Your current plan
                  </Button>
                ) : item.id === 'free' ? (
                  <Button fullWidth variant="secondary" onClick={switchToFree}>
                    {isCancelledCurrent ? 'Reactivate Free' : 'Switch to Free'}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    to={`/checkout?plan=${item.id}&interval=${interval}`}
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    {isCancelledCurrent ? 'Reactivate' : item.cta}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Alert variant="warning" className="mt-6" title="No real payments">
        This is a front-end demonstration. Checkout is simulated, no payment details are collected,
        and no subscription is actually created with a payment provider.
      </Alert>

      <section className="mt-8">
        <div className="mb-4">
          <p className="eyebrow">Compare quietly</p>
          <h2 className="display-section mt-2">What each plan includes</h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-bg-card">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <caption className="sr-only">Comparison of Free, Plus and Premium demo memberships</caption>
            <thead>
              <tr className="border-b border-line bg-bg-secondary/50">
                <th scope="col" className="px-4 py-3 text-xs font-semibold text-ink-muted sm:px-5">
                  Feature
                </th>
                {plans.map((item) => (
                  <th
                    key={item.id}
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold text-ink-primary sm:px-5"
                  >
                    {item.name}
                    {item.id === subscription.planId && currentActive && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase text-success">current</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureGroups.map((group) => (
                <FragmentRows key={group.title} group={group} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-ink-muted">
          Limits and benefits are display-only in this demo. They do not restrict your actions
          beyond the simulated messaging rules described in the product.
        </p>
      </section>
    </div>
  )
}

function FragmentRows({ group }) {
  return (
    <>
      <tr className="border-b border-line bg-bg-secondary/30">
        <th
          scope="rowgroup"
          colSpan={4}
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink-muted sm:px-5"
        >
          {group.title}
        </th>
      </tr>
      {group.features.map((feature) => (
        <tr key={feature.label} className="border-b border-line last:border-b-0">
          <th scope="row" className="px-4 py-3 text-xs font-medium text-ink-secondary sm:px-5">
            {feature.label}
          </th>
          <td className="px-4 py-3 text-xs text-ink-secondary sm:px-5">{feature.free}</td>
          <td className="px-4 py-3 text-xs font-medium text-ink-primary sm:px-5">{feature.plus}</td>
          <td className="px-4 py-3 text-xs text-ink-secondary sm:px-5">{feature.premium}</td>
        </tr>
      ))}
    </>
  )
}
