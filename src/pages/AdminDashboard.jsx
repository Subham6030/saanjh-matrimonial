import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CreditCard,
  Flag,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { formatCurrency, formatDate, relativeTime } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdmin } from '../context/AdminContext'
import Button from '../components/common/Button'
import { Avatar, Badge, PageHeader, StatCard } from '../components/common/ui'

const activityMeta = {
  profile: { icon: UserRound, tone: 'bg-brand/10 text-brand' },
  report: { icon: Flag, tone: 'bg-error/10 text-error' },
  subscription: { icon: CreditCard, tone: 'bg-brand-accent/15 text-warning' },
}

function Section({ title, description, action, children, className }) {
  return (
    <section className={cn('card-surface p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-primary">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function AdminDashboard() {
  usePageMeta('Admin overview', 'Demo administration dashboard for the Saanjh matrimonial front-end.')

  const {
    adminProfiles,
    reports,
    subscriptions,
    pendingReports,
    recentActivity,
  } = useAdmin()

  const stats = useMemo(() => {
    const activeProfiles = adminProfiles.filter((profile) => profile.status === 'active').length
    const pendingReview = adminProfiles.filter((profile) => profile.reviewStatus === 'pending').length
    const verified = adminProfiles.filter((profile) => profile.verified).length
    const paidActive = subscriptions.filter(
      (subscription) => subscription.status === 'active' && subscription.amount > 0,
    )
    const mrr = paidActive.reduce(
      (total, subscription) =>
        total + (subscription.interval === 'yearly' ? subscription.amount / 12 : subscription.amount),
      0,
    )
    return { activeProfiles, pendingReview, verified, mrr: Math.round(mrr), paidActive: paidActive.length }
  }, [adminProfiles, subscriptions])

  const pendingProfiles = adminProfiles.filter((profile) => profile.reviewStatus === 'pending').slice(0, 4)
  const latestReports = reports.filter((report) => report.status === 'pending').slice(0, 3)
  const latestActivity = recentActivity.slice(0, 6)

  const planMix = useMemo(() => {
    const counts = subscriptions.reduce(
      (accumulator, subscription) => {
        accumulator[subscription.plan] = (accumulator[subscription.plan] || 0) + 1
        return accumulator
      },
      { free: 0, plus: 0, premium: 0 },
    )
    const total = subscriptions.length || 1
    return ['premium', 'plus', 'free'].map((plan) => ({
      plan,
      count: counts[plan] || 0,
      percent: Math.round(((counts[plan] || 0) / total) * 100),
    }))
  }, [subscriptions])

  const registrationSeries = useMemo(
    () =>
      ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, index) => ({
        label,
        value: [8, 12, 9, 16, 21, 18, 12][index],
      })),
    [],
  )
  const seriesMax = Math.max(...registrationSeries.map((item) => item.value), 1)

  return (
    <div>
      <PageHeader
        eyebrow="Admin overview"
        title="Platform at a glance"
        description="A front-end-only view of sample profiles, memberships and moderation activity. All actions are simulated."
        actions={
          <>
            <Button to="/admin/reports" size="sm" leftIcon={<Flag className="h-3.5 w-3.5" />}>
              Review reports {pendingReports > 0 && `(${pendingReports})`}
            </Button>
            <Button to="/admin/profiles" variant="secondary" size="sm">
              Manage profiles
            </Button>
          </>
        }
      />

      <div
        className="mb-5 flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3.5 text-sm text-ink-secondary"
        role="note"
      >
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
        <p>
          <span className="font-semibold text-ink-primary">Demo console.</span> Admin access is
          simulated in the browser. Never use this pattern for real member data, payments or
          moderation.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Sample profiles"
          value={adminProfiles.length}
          helper={`${stats.activeProfiles} active · ${stats.pendingReview} awaiting review`}
          to="/admin/profiles"
        />
        <StatCard
          icon={BadgeCheck}
          label="Verified profiles"
          value={stats.verified}
          helper="Demo verification only — no identity checks."
          tone="success"
          to="/admin/profiles"
        />
        <StatCard
          icon={Flag}
          label="Open reports"
          value={pendingReports}
          helper="Sample reports waiting for moderator review."
          tone="error"
          to="/admin/reports"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly recurring"
          value={formatCurrency(stats.mrr)}
          helper={`${stats.paidActive} paid sample memberships`}
          tone="accent"
          to="/admin/subscriptions"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Section
            title="Sample registrations"
            description="Illustrative profile growth over the last seven months."
            action={<Badge tone="neutral" size="sm">Demo chart</Badge>}
          >
            <div className="flex h-44 items-end gap-2 sm:gap-3" role="img" aria-label="Sample monthly registrations bar chart">
              {registrationSeries.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[10px] font-semibold text-ink-secondary">{item.value}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-brand/70 to-brand/35 transition-all"
                    style={{ height: `${Math.max(8, (item.value / seriesMax) * 100)}%` }}
                  />
                  <span className="text-[10px] text-ink-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Profiles awaiting review"
            description="New sample profiles flagged for a moderation check."
            action={
              <Link to="/admin/profiles" className="text-xs font-semibold text-brand hover:underline">
                All profiles
              </Link>
            }
          >
            {pendingProfiles.length ? (
              <div className="divide-y divide-line">
                {pendingProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar src={profile.primaryPhoto} name={profile.displayName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/profile/${profile.id}`}
                        className="truncate text-sm font-semibold text-ink-primary hover:text-brand"
                      >
                        {profile.displayName}
                      </Link>
                      <p className="truncate text-xs text-ink-muted">
                        {profile.profession} · {profile.city} · joined {formatDate(profile.joinedAt)}
                      </p>
                    </div>
                    <Badge tone="warning" size="sm">Pending</Badge>
                    <Button to="/admin/profiles" variant="ghost" size="sm" className="hidden sm:inline-flex">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-ink-muted">No profiles are waiting for review.</p>
            )}
          </Section>

          <Section
            title="Moderation queue"
            description="Recent sample reports that need a decision."
            action={
              <Link to="/admin/reports" className="text-xs font-semibold text-brand hover:underline">
                Open reports
              </Link>
            }
          >
            {latestReports.length ? (
              <div className="space-y-2">
                {latestReports.map((report) => {
                  const profile = adminProfiles.find((item) => item.id === report.profileId)
                  return (
                    <Link
                      key={report.id}
                      to="/admin/reports"
                      className="flex items-start gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-bg-secondary"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error/10 text-error">
                        <Flag className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-primary">
                          {report.reason}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-muted">
                          {profile?.displayName || report.profileId} · reported by {report.reporterName}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] text-ink-muted">{relativeTime(report.createdAt)}</span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-ink-muted">The moderation queue is clear.</p>
            )}
          </Section>
        </div>

        <aside className="space-y-5">
          <Section title="Membership mix" description="Distribution across sample subscriptions.">
            <div className="space-y-4">
              {planMix.map((item) => (
                <div key={item.plan}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-ink-secondary">{item.plan}</span>
                    <span className="text-ink-muted">{item.count} · {item.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        item.plan === 'premium' ? 'bg-brand' : item.plan === 'plus' ? 'bg-brand-accent' : 'bg-line',
                      )}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button to="/admin/subscriptions" variant="secondary" size="sm" className="mt-5 w-full">
              Manage subscriptions
            </Button>
          </Section>

          <Section
            title="Recent activity"
            description="Simulated events recorded in this browser."
          >
            {latestActivity.length ? (
              <div className="space-y-3">
                {latestActivity.map((item) => {
                  const meta = activityMeta[item.type] || activityMeta.profile
                  const Icon = meta.icon
                  return (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', meta.tone)}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-5 text-ink-primary">{item.text}</p>
                        <p className="truncate text-[10px] text-ink-muted">{item.detail}</p>
                        <p className="mt-0.5 text-[10px] text-ink-muted">{relativeTime(item.at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-5 text-center text-xs text-ink-muted">No recorded activity in this demo yet.</p>
            )}
          </Section>

          <Section title="Quick links">
            <div className="grid gap-2">
              {[
                { to: '/admin/profiles', label: 'Profiles & verification', icon: Users },
                { to: '/admin/subscriptions', label: 'Subscriptions & billing', icon: CreditCard },
                { to: '/admin/settings', label: 'Platform settings', icon: ShieldCheck },
                { to: '/admin/reports', label: 'Reports & moderation', icon: Flag },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
                >
                  <item.icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  {item.label}
                  <ArrowRight className="ml-auto h-3 w-3" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </Section>
        </aside>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-line bg-bg-secondary/40 p-4 text-[11px] leading-5 text-ink-muted">
        <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        Charts and statistics are illustrative sample data. They are not connected to analytics or a
        real backend.
      </div>
    </div>
  )
}
