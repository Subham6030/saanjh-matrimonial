import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Crown,
  Heart,
  MailOpen,
  Megaphone,
  MessageCircle,
  Trash2,
  UserRound,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { relativeTime } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useNotifications } from '../context/NotificationContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import { Badge, EmptyState, PageHeader, Tabs } from '../components/common/ui'
import { ConfirmDialog } from '../components/common/Modal'

const typeMeta = {
  interest: { icon: Heart, tone: 'bg-brand/10 text-brand' },
  message: { icon: MessageCircle, tone: 'bg-success/10 text-success' },
  profile: { icon: UserRound, tone: 'bg-brand-accent/15 text-warning' },
  subscription: { icon: Crown, tone: 'bg-brand-accent/15 text-warning' },
  announcement: { icon: Megaphone, tone: 'bg-bg-secondary text-ink-secondary' },
}

export default function Notifications() {
  usePageMeta(
    'Notifications',
    'Updates, interests, messages and announcements from the Saanjh matrimonial demo.',
  )
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
    clearAll,
  } = useNotifications()
  const toast = useToast()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [clearOpen, setClearOpen] = useState(false)

  const visible = useMemo(
    () => (filter === 'unread' ? notifications.filter((item) => !item.read) : notifications),
    [notifications, filter],
  )

  const tabs = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
  ]

  function openNotification(item) {
    markRead(item.id)
    if (item.to) navigate(item.to)
  }

  function handleMarkAll() {
    markAllRead()
    toast.success('All notifications are marked as read.')
  }

  function handleClearAll() {
    clearAll()
    setClearOpen(false)
    toast.info('All notifications were cleared from this demo.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        description="A record of interest, messages and gentle nudges. Everything here is simulated."
        actions={
          <>
            <Badge tone={unreadCount ? 'brand' : 'neutral'} size="sm">
              {unreadCount} unread
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
              leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClearOpen(true)}
              disabled={notifications.length === 0}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Clear all
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <Tabs tabs={tabs} value={filter} onChange={setFilter} ariaLabel="Notification filters" />

        {visible.length ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-bg-card">
            {visible.map((item) => {
              const meta = typeMeta[item.type] || { icon: Bell, tone: 'bg-bg-secondary text-ink-secondary' }
              const Icon = meta.icon
              return (
                <article
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:px-5',
                    !item.read && 'bg-brand/[0.035]',
                  )}
                >
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', meta.tone)}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <button
                    type="button"
                    onClick={() => openNotification(item)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <p
                        className={cn(
                          'min-w-0 flex-1 text-sm leading-5',
                          item.read ? 'font-medium text-ink-primary' : 'font-semibold text-ink-primary',
                        )}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-secondary">{item.body}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider text-ink-muted">
                      {item.type} · {relativeTime(item.createdAt)}
                    </p>
                  </button>

                  <div className="flex shrink-0 items-center gap-0.5">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        className="btn-icon"
                        aria-label={`Mark “${item.title}” as read`}
                        title="Mark as read"
                      >
                        <MailOpen className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNotification(item.id)}
                      className="btn-icon hover:text-error"
                      aria-label={`Delete “${item.title}”`}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'You are all caught up' : 'No notifications yet'}
            description={
              filter === 'unread'
                ? 'Every notification has been read. New activity will appear here.'
                : 'Interests, messages and demo announcements will show up in this space.'
            }
            action={
              filter === 'unread' ? (
                <Button variant="secondary" size="sm" onClick={() => setFilter('all')}>
                  View all notifications
                </Button>
              ) : (
                <Button to="/matches" size="sm">
                  Explore matches
                </Button>
              )
            }
          />
        )}
      </div>

      <ConfirmDialog
        open={clearOpen}
        title="Clear all notifications?"
        description="This removes every notification from this browser for the demo."
        confirmLabel="Clear notifications"
        onConfirm={handleClearAll}
        onCancel={() => setClearOpen(false)}
      >
        You cannot undo this, but new demo activity will still create fresh notifications.
      </ConfirmDialog>
    </div>
  )
}
