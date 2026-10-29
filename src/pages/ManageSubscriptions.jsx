import { useMemo, useState } from 'react'
import {
  Ban,
  CircleDollarSign,
  CreditCard,
  Pause,
  Play,
  Search,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { formatCurrency, formatDate } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import { ConfirmDialog } from '../components/common/Modal'
import {
  Avatar,
  Badge,
  EmptyState,
  PageHeader,
  StatCard,
} from '../components/common/ui'
import { Input, SelectField } from '../components/forms/FormControls'

const statusTone = {
  active: 'success',
  paused: 'warning',
  cancelled: 'neutral',
  expired: 'error',
}

const paymentTone = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'neutral',
  'not-applicable': 'neutral',
}

export default function ManageSubscriptions() {
  usePageMeta('Subscription management', 'Review sample memberships and simulate subscription actions in the Saanjh demo.')
  const { subscriptions, updateSubscription, recordActivity } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cancelTarget, setCancelTarget] = useState(null)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return subscriptions.filter((subscription) => {
      const matchesQuery =
        !term ||
        subscription.memberName.toLowerCase().includes(term) ||
        subscription.email.toLowerCase().includes(term) ||
        subscription.profileId.toLowerCase().includes(term)
      const matchesPlan = planFilter === 'all' || subscription.plan === planFilter
      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter
      return matchesQuery && matchesPlan && matchesStatus
    })
  }, [planFilter, query, statusFilter, subscriptions])

  const stats = useMemo(() => {
    const activePaid = subscriptions.filter(
      (subscription) => subscription.status === 'active' && subscription.amount > 0,
    )
    const mrr = activePaid.reduce(
      (total, subscription) =>
        total + (subscription.interval === 'yearly' ? subscription.amount / 12 : subscription.amount),
      0,
    )
    const issues = subscriptions.filter(
      (subscription) => subscription.paymentStatus === 'failed' || subscription.paymentStatus === 'pending',
    ).length
    const yearly = activePaid.filter((subscription) => subscription.interval === 'yearly').length
    return { mrr: Math.round(mrr), activePaid: activePaid.length, issues, yearly }
  }, [subscriptions])

  function logChange(subscription, text, status) {
    recordActivity({
      type: 'subscription',
      text,
      detail: `${subscription.memberName} · ${subscription.plan} ${subscription.interval} · demo ${status}`,
    })
  }

  function setStatus(subscription, nextStatus) {
    updateSubscription(subscription.id, {
      status: nextStatus,
      paymentStatus:
        nextStatus === 'active'
          ? subscription.amount > 0
            ? 'paid'
            : 'not-applicable'
          : subscription.paymentStatus,
    })
    logChange(
      subscription,
      nextStatus === 'active'
        ? 'Subscription reactivated'
        : nextStatus === 'paused'
          ? 'Subscription paused'
          : 'Subscription cancelled',
      nextStatus,
    )
    toast.success(
      nextStatus === 'active'
        ? `${subscription.memberName}'s demo membership is active again.`
        : nextStatus === 'paused'
          ? `${subscription.memberName}'s demo membership was paused.`
          : `${subscription.memberName}'s demo membership was cancelled.`,
    )
  }

  function confirmCancel() {
    if (!cancelTarget) return
    setStatus(cancelTarget, 'cancelled')
    setCancelTarget(null)
  }

  function clearFilters() {
    setQuery('')
    setPlanFilter('all')
    setStatusFilter('all')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Memberships"
        title="Subscription management"
        description="Inspect simulated plans, payment states and renewal dates. All amounts and transactions are sample data."
        actions={
          <Button to="/plans" variant="secondary" size="sm">
            View public plans
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CreditCard}
          label="Paid subscriptions"
          value={stats.activePaid}
          helper="Active Plus and Premium sample memberships."
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly recurring"
          value={formatCurrency(stats.mrr)}
          helper="Yearly plans normalised to a monthly figure."
          tone="success"
        />
        <StatCard
          icon={CircleDollarSign}
          label="Yearly plans"
          value={stats.yearly}
          helper="Active sample members billed yearly."
          tone="accent"
        />
        <StatCard
          icon={WalletCards}
          label="Payment issues"
          value={stats.issues}
          helper="Sample payments marked pending or failed."
          tone="error"
        />
      </div>

      <div className="card-surface mt-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_170px_170px]">
          <label className="relative block">
            <span className="sr-only">Search subscriptions</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search member, email or profile ID"
              className="pl-9"
            />
          </label>
          <SelectField
            label=""
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
            aria-label="Filter by plan"
          >
            <option value="all">All plans</option>
            <option value="free">Free</option>
            <option value="plus">Plus</option>
            <option value="premium">Premium</option>
          </SelectField>
          <SelectField
            label=""
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by subscription status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </SelectField>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-ink-muted">
            Showing {filtered.length} of {subscriptions.length} subscriptions
          </p>
          {(query || planFilter !== 'all' || statusFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {filtered.length ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="border-b border-line bg-bg-secondary/60 text-[10px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Member</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Amount</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Billing</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Renewal</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Payment</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((subscription) => (
                  <tr key={subscription.id} className="align-middle transition-colors hover:bg-bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={subscription.memberName} size="xs" />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-primary">{subscription.memberName}</p>
                          <p className="truncate text-[10px] text-ink-muted">{subscription.email}</p>
                          <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                            {subscription.profileId} · {subscription.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={subscription.plan === 'premium' ? 'brand' : subscription.plan === 'plus' ? 'accent' : 'neutral'}
                        size="sm"
                        className="capitalize"
                      >
                        {subscription.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-ink-primary">
                        {subscription.amount ? formatCurrency(subscription.amount) : 'No charge'}
                      </p>
                      <p className="text-[10px] text-ink-muted">simulated</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs capitalize text-ink-secondary">{subscription.interval}</p>
                      <p className="text-[10px] text-ink-muted">from {formatDate(subscription.startedAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-secondary">
                      {subscription.renewsAt ? formatDate(subscription.renewsAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={paymentTone[subscription.paymentStatus] || 'neutral'} size="sm" className="capitalize">
                        {subscription.paymentStatus.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[subscription.status] || 'neutral'} size="sm" className="capitalize">
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {subscription.status === 'active' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setStatus(subscription, 'paused')}
                              className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-warning/10 hover:text-warning"
                              title="Pause sample subscription"
                              aria-label={`Pause ${subscription.memberName}'s demo subscription`}
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelTarget(subscription)}
                              className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-error/10 hover:text-error"
                              title="Cancel sample subscription"
                              aria-label={`Cancel ${subscription.memberName}'s demo subscription`}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {subscription.status === 'paused' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setStatus(subscription, 'active')}
                              className="rounded-lg p-1.5 text-success transition-colors hover:bg-success/10"
                              title="Resume sample subscription"
                              aria-label={`Resume ${subscription.memberName}'s demo subscription`}
                            >
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelTarget(subscription)}
                              className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-error/10 hover:text-error"
                              title="Cancel sample subscription"
                              aria-label={`Cancel ${subscription.memberName}'s demo subscription`}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {(subscription.status === 'cancelled' || subscription.status === 'expired') && (
                          <button
                            type="button"
                            onClick={() => setStatus(subscription, 'active')}
                            className="rounded-lg p-1.5 text-success transition-colors hover:bg-success/10"
                            title="Reactivate sample subscription"
                            aria-label={`Reactivate ${subscription.memberName}'s demo subscription`}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No subscriptions match"
          description="Try a different member search, plan or status filter."
          className="mt-4"
          action={<Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>}
        />
      )}

      <div className={cn('mt-4 flex items-start gap-2 rounded-xl border border-line bg-bg-secondary/40 p-4 text-[11px] leading-5 text-ink-muted')}>
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        These are sample membership records, not real members. Pausing, cancelling or reactivating a
        subscription never contacts a payment provider.
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this demo subscription?"
        description="The sample membership will be marked as cancelled. No refund or payment action occurs."
        confirmLabel="Cancel subscription"
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      >
        {cancelTarget
          ? `${cancelTarget.memberName}'s ${cancelTarget.plan} plan will show as cancelled in the demo data.`
          : ''}
      </ConfirmDialog>
    </div>
  )
}
