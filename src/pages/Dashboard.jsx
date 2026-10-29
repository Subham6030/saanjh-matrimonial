import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  Bookmark,
  Crown,
  Heart,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { firstName, relativeTime } from '../utils/format'
import { primaryPhoto } from '../utils/profile'
import { rankProfiles } from '../utils/compatibility'
import { getProfileById, profiles } from '../data/profiles'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useMatch } from '../context/MatchContext'
import { useMessaging } from '../context/MessagingContext'
import { useProfile } from '../context/ProfileContext'
import { useSubscription } from '../context/SubscriptionContext'
import { useProfileActions } from '../hooks/useProfileActions'
import Button from '../components/common/Button'
import ProfileCard from '../components/profiles/ProfileCard'
import {
  Avatar,
  Badge,
  EmptyState,
  PageHeader,
  ProgressRing,
  StatCard,
} from '../components/common/ui'

const notificationMeta = {
  interest: { icon: Heart, tone: 'bg-brand/10 text-brand' },
  message: { icon: MessageCircle, tone: 'bg-success/10 text-success' },
  profile: { icon: UserRound, tone: 'bg-brand-accent/15 text-warning' },
  subscription: { icon: Crown, tone: 'bg-brand-accent/15 text-warning' },
  announcement: { icon: Bell, tone: 'bg-bg-secondary text-ink-secondary' },
}

const interestTone = {
  pending: 'brand',
  accepted: 'success',
  declined: 'neutral',
}

function Panel({ title, action, children, className }) {
  return (
    <section className={cn('card-surface p-5', className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink-primary">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function Dashboard() {
  usePageMeta('Dashboard', 'Your Saanjh demo dashboard with matches, interests, conversations and notifications.')
  const { user } = useAuth()
  const { profile, preferences, completeness } = useProfile()
  const { shortlist, pendingReceived, passed, blocked, getInterestFor } = useMatch()
  const {
    sortedConversations,
    unreadTotal,
    setActiveConversation,
  } = useMessaging()
  const {
    notifications,
    unreadCount,
    markRead,
  } = useNotifications()
  const { plan, subscription } = useSubscription()
  const { isShortlisted, handleShortlist, handleInterest, handleMessage, handlePass } =
    useProfileActions()
  const navigate = useNavigate()

  const memberName = firstName(profile?.displayName || user?.name || 'there')

  const recommended = useMemo(
    () =>
      rankProfiles(profiles, profile, preferences, {
        excludeIds: [...passed, ...blocked],
      }).slice(0, 3),
    [blocked, passed, preferences, profile],
  )

  const newToday = useMemo(
    () =>
      profiles.filter(
        (item) => item.isNew && item.gender === preferences.lookingFor && !blocked.includes(item.id),
      ).length,
    [blocked, preferences.lookingFor],
  )

  const recentConversations = sortedConversations.slice(0, 3)
  const recentNotifications = notifications.slice(0, 3)
  const interestsToReview = pendingReceived.slice(0, 4)
  const missing = completeness.missing.slice(0, 2)

  function openNotification(item) {
    markRead(item.id)
    navigate(item.to || '/notifications')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${memberName}`}
        description="A quiet overview of your profile, your connections and the people waiting to meet you."
        actions={
          <>
            <Button to="/matches" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
              Discover matches
            </Button>
            <Button to="/profile/edit" variant="secondary" size="sm">
              Edit profile
            </Button>
          </>
        }
      />

      <section className="relative mb-5 overflow-hidden rounded-2xl border border-line bg-bg-card p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-brand-accent/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            src={primaryPhoto(profile)}
            name={profile?.displayName || memberName}
            size="xl"
            className="ring-2 ring-bg-card"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning" size="sm">Demo member</Badge>
              <Badge tone="brand" size="sm" dot>{plan.name} member</Badge>
              {subscription.status !== 'active' && (
                <Badge tone="neutral" size="sm">Cancelled</Badge>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl text-ink-primary">{profile?.displayName || user?.name}</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              {profile?.headline || 'Add a headline to help the right person find you.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span>{completeness.complete} of {completeness.total} profile details complete</span>
              {missing.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Next: {missing.join(', ')}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <ProgressRing value={completeness.percent} size={86} />
            <Button
              to={completeness.percent >= 100 ? '/profile/me' : '/profile/edit'}
              variant="secondary"
              size="sm"
            >
              {completeness.percent >= 100 ? 'View profile' : 'Complete profile'}
            </Button>
          </div>
        </div>
      </section>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Sparkles}
          label="New today"
          value={newToday}
          helper="Fresh sample profiles that fit your preferences."
          to="/matches"
        />
        <StatCard
          icon={Heart}
          label="Interests waiting"
          value={pendingReceived.length}
          helper="Sample members hoping to hear from you."
          tone="accent"
          to="/interests"
        />
        <StatCard
          icon={MessageCircle}
          label="Unread messages"
          value={unreadTotal}
          helper="Conversations with accepted connections."
          tone="success"
          to="/messages"
        />
        <StatCard
          icon={Bookmark}
          label="Shortlisted"
          value={shortlist.length}
          helper="Profiles you saved to revisit."
          tone="warning"
          to="/shortlist"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">Compatibility-led</p>
                <h2 className="font-display text-xl text-ink-primary">Chosen for you</h2>
              </div>
              <Link
                to="/matches"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            {recommended.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {recommended.map((item, index) => (
                  <ProfileCard
                    key={item.id}
                    profile={item}
                    match={item.match}
                    isShortlisted={isShortlisted(item.id)}
                    interest={getInterestFor(item.id)}
                    onShortlist={handleShortlist}
                    onInterest={handleInterest}
                    onMessage={handleMessage}
                    onPass={handlePass}
                    imagePriority={index === 0}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Your next match is close"
                description="Try widening your preferences or resetting demo data from settings to see more sample profiles."
                action={<Button to="/preferences" size="sm">Adjust preferences</Button>}
              />
            )}
          </section>

          <Panel
            title="Interests to respond to"
            action={
              <Link to="/interests" className="text-xs font-semibold text-brand hover:underline">
                View interests
              </Link>
            }
          >
            {interestsToReview.length ? (
              <div className="divide-y divide-line">
                {interestsToReview.map((interest) => {
                  const person = getProfileById(interest.profileId)
                  if (!person) return null
                  return (
                    <div key={interest.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <Avatar src={primaryPhoto(person)} name={person.displayName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/profile/${person.id}`}
                          className="truncate text-sm font-semibold text-ink-primary hover:text-brand"
                        >
                          {person.displayName}
                        </Link>
                        <p className="truncate text-xs text-ink-muted">
                          {person.profession} · {person.city} · {relativeTime(interest.createdAt)}
                        </p>
                      </div>
                      <Badge tone={interestTone[interest.status] || 'neutral'} size="sm" className="capitalize">
                        {interest.status}
                      </Badge>
                      <Button to="/interests" variant="ghost" size="sm" className="hidden sm:inline-flex">
                        Respond
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="No interests waiting"
                description="When a sample member expresses interest, you will see it here."
                compact
              />
            )}
          </Panel>
        </div>

        <aside className="min-w-0 space-y-5">
          <Panel
            title="Recent conversations"
            action={
              <Link to="/messages" className="text-xs font-semibold text-brand hover:underline">
                Inbox
              </Link>
            }
          >
            {recentConversations.length ? (
              <div className="space-y-1">
                {recentConversations.map((conversation) => {
                  const person = getProfileById(conversation.profileId)
                  const last = conversation.messages?.[conversation.messages.length - 1]
                  return (
                    <Link
                      key={conversation.id}
                      to={`/messages?c=${conversation.id}`}
                      onClick={() => setActiveConversation(conversation.id)}
                      className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-secondary"
                    >
                      <Avatar src={primaryPhoto(person)} name={person?.displayName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-ink-primary">
                            {person?.displayName || 'Sample connection'}
                          </p>
                          <span className="shrink-0 text-[10px] text-ink-muted">
                            {last ? relativeTime(last.at) : 'New'}
                          </span>
                        </div>
                        <p className={cn('mt-0.5 truncate text-xs', conversation.unread ? 'font-medium text-ink-primary' : 'text-ink-muted')}>
                          {last?.text || 'Say hello when you are ready.'}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                      )}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={MessageCircle}
                title="No conversations yet"
                description="Accepted interests open the door to a conversation."
                compact
              />
            )}
          </Panel>

          <Panel
            title="Notifications"
            action={
              <Link to="/notifications" className="text-xs font-semibold text-brand hover:underline">
                {unreadCount ? `${unreadCount} unread` : 'View all'}
              </Link>
            }
          >
            {recentNotifications.length ? (
              <div className="space-y-1">
                {recentNotifications.map((item) => {
                  const meta = notificationMeta[item.type] || notificationMeta.announcement
                  const Icon = meta.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openNotification(item)}
                      className="flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-bg-secondary"
                    >
                      <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', meta.tone)}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className={cn('block truncate text-xs', item.read ? 'font-medium text-ink-secondary' : 'font-semibold text-ink-primary')}>
                            {item.title}
                          </span>
                          {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-ink-muted">{item.body}</span>
                        <span className="mt-1 block text-[10px] text-ink-muted">{relativeTime(item.createdAt)}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon={Bell} title="All quiet" description="You have no notifications in this demo." compact />
            )}
          </Panel>

          <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">Your plan</p>
                <p className="font-display text-xl text-ink-primary">{plan.name}</p>
                <p className="mt-1 text-xs leading-5 text-ink-secondary">
                  {plan.id === 'free'
                    ? 'Upgrade to connect more thoughtfully.'
                    : 'Simulated membership. No payment was taken.'}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Crown className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <Button to="/plans" variant="secondary" size="sm" className="mt-4 w-full">
              {plan.id === 'free' ? 'Explore memberships' : 'Manage plan'}
            </Button>
          </section>
        </aside>
      </div>
    </div>
  )
}
