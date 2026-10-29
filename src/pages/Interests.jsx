import { useMemo, useState } from 'react'
import { Check, Heart, MailOpen, MessageCircle, Search, X } from 'lucide-react'
import { computeCompatibility } from '../utils/compatibility'
import { relativeTime } from '../utils/format'
import { profileAge, profileLocation } from '../utils/profile'
import { usePageMeta } from '../hooks/usePageMeta'
import { useMatch } from '../context/MatchContext'
import { useNotifications } from '../context/NotificationContext'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { getProfileById } from '../data/profiles'
import Button from '../components/common/Button'
import CompatibilityPill from '../components/profiles/CompatibilityPill'
import { Avatar, Badge, EmptyState, PageHeader, Tabs } from '../components/common/ui'
import { ConfirmDialog } from '../components/common/Modal'

const statusTone = {
  pending: 'warning',
  accepted: 'success',
  declined: 'neutral',
}

export default function Interests() {
  usePageMeta(
    'Interests',
    'Review interests received and sent, accept a connection or start a simulated conversation in the Saanjh demo.',
  )
  const { interests, acceptInterest, declineInterest } = useMatch()
  const { profile, preferences } = useProfile()
  const { addNotification } = useNotifications()
  const { handleMessage } = useProfileActions()
  const toast = useToast()
  const [tab, setTab] = useState('received')
  const [declineTarget, setDeclineTarget] = useState(null)

  const records = useMemo(
    () =>
      interests
        .map((record) => ({ ...record, profile: getProfileById(record.profileId) }))
        .filter((record) => record.profile)
        .map((record) => ({
          ...record,
          score: computeCompatibility(record.profile, profile, preferences).score,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [interests, profile, preferences],
  )

  const lists = {
    received: records.filter((record) => record.direction === 'incoming' && record.status === 'pending'),
    sent: records.filter((record) => record.direction === 'outgoing' && record.status === 'pending'),
    accepted: records.filter((record) => record.status === 'accepted'),
    closed: records.filter((record) => record.status === 'declined'),
  }

  const tabs = [
    { value: 'received', label: 'Received', count: lists.received.length },
    { value: 'sent', label: 'Sent', count: lists.sent.length },
    { value: 'accepted', label: 'Accepted', count: lists.accepted.length },
    { value: 'closed', label: 'Closed', count: lists.closed.length },
  ]

  const visible = lists[tab] || []

  function handleAccept(record) {
    acceptInterest(record.id)
    addNotification({
      type: 'interest',
      title: `You accepted ${record.profile.displayName}'s interest`,
      body: 'You can now start a conversation in this demo.',
      to: `/profile/${record.profile.id}`,
      profileId: record.profile.id,
    })
    toast.success(
      `You are now connected with ${record.profile.displayName}. You can send a simulated message.`,
      { title: 'Interest accepted' },
    )
  }

  function handleDecline() {
    if (!declineTarget) return
    declineInterest(declineTarget.id)
    toast.info(`You declined ${declineTarget.profile.displayName}'s interest.`)
    setDeclineTarget(null)
  }

  const emptyCopy = {
    received: {
      title: 'No new interests',
      description: 'When a sample profile expresses interest, it will appear here for you to respond to.',
    },
    sent: {
      title: 'No pending interests',
      description: 'Interests you send will wait here until the sample member responds.',
    },
    accepted: {
      title: 'No connections yet',
      description: 'Accepted interests will appear here with a shortcut to your simulated conversation.',
    },
    closed: {
      title: 'Nothing closed',
      description: 'Declined interests will be kept here quietly for reference.',
    },
  }

  return (
    <div>
      <PageHeader
        eyebrow="Connections"
        title="Interests"
        description="A simple record of interest received and expressed. Every response here is simulated; no real person is contacted."
        actions={
          <>
            <Badge tone="warning" size="sm">
              <MailOpen className="h-3 w-3" aria-hidden="true" /> {lists.received.length} awaiting reply
            </Badge>
            <Button to="/matches" variant="secondary" size="sm">
              Find matches
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Interest categories" />

        {visible.length ? (
          <div className="space-y-3">
            {visible.map((record) => {
              const item = record.profile
              const isIncoming = record.direction === 'incoming'
              return (
                <article key={record.id} className="card-surface p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Avatar src={item.primaryPhoto} name={item.displayName} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Button
                            to={`/profile/${item.id}`}
                            variant="link"
                            className="font-display text-lg"
                          >
                            {item.displayName}
                          </Button>
                          <span className="text-xs text-ink-muted">{profileAge(item)}</span>
                          <Badge tone={statusTone[record.status] || 'neutral'} size="sm">
                            {record.status === 'pending'
                              ? isIncoming
                                ? 'Awaiting your reply'
                                : 'Waiting for reply'
                              : record.status === 'accepted'
                                ? 'Connected'
                                : 'Closed'}
                          </Badge>
                          <CompatibilityPill score={record.score} size="sm" />
                        </div>
                        <p className="mt-1 text-xs text-ink-secondary">
                          {item.profession} · {profileLocation(item)}
                        </p>
                        {record.note && (
                          <blockquote className="mt-2 rounded-lg border-l-2 border-brand/30 bg-bg-secondary/60 px-3 py-2 text-xs leading-5 text-ink-secondary">
                            “{record.note}”
                          </blockquote>
                        )}
                        <p className="mt-2 text-[11px] text-ink-muted">
                          {isIncoming ? 'Received' : 'Sent'} {relativeTime(record.createdAt)}
                          {record.respondedAt ? ` · Responded ${relativeTime(record.respondedAt)}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                      {record.status === 'pending' && isIncoming && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(record)}
                            leftIcon={<Check className="h-3.5 w-3.5" />}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setDeclineTarget(record)}
                            leftIcon={<X className="h-3.5 w-3.5" />}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {record.status === 'accepted' && (
                        <Button
                          size="sm"
                          onClick={() => handleMessage(item)}
                          leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
                        >
                          Message
                        </Button>
                      )}
                      <Button to={`/profile/${item.id}`} variant="ghost" size="sm">
                        View profile
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title={emptyCopy[tab].title}
            description={emptyCopy[tab].description}
            action={
              <Button to="/matches" size="sm" leftIcon={<Search className="h-4 w-4" />}>
                Explore matches
              </Button>
            }
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(declineTarget)}
        title={declineTarget ? `Decline ${declineTarget.profile.displayName}'s interest?` : 'Decline interest?'}
        description="This closes the interest in the demo. It does not notify any real person."
        confirmLabel="Decline interest"
        onConfirm={handleDecline}
        onCancel={() => setDeclineTarget(null)}
      >
        Declining is recorded immediately but does not block the profile. You can still view it later.
      </ConfirmDialog>
    </div>
  )
}
