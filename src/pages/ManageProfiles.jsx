import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Ban,
  Check,
  ExternalLink,
  PenLine,
  RotateCcw,
  Search,
  ShieldCheck,
  ShieldX,
  Users,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { formatDate, relativeTime } from '../utils/format'
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
  Pagination,
  Tabs,
} from '../components/common/ui'
import { Input, SelectField } from '../components/forms/FormControls'

const pageSize = 8

const reviewTone = {
  pending: 'warning',
  approved: 'success',
  'changes-requested': 'warning',
  reviewed: 'brand',
}

const reviewLabel = {
  pending: 'Pending review',
  approved: 'Approved',
  'changes-requested': 'Changes requested',
  reviewed: 'Reviewed',
}

export default function ManageProfiles() {
  usePageMeta('Profile management', 'Review, verify and moderate sample profiles in the Saanjh demo admin console.')
  const {
    adminProfiles,
    verifyProfile,
    setProfileStatus,
    updateProfileOverride,
    recordActivity,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [review, setReview] = useState('all')
  const [page, setPage] = useState(1)
  const [pendingAction, setPendingAction] = useState(null)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return adminProfiles.filter((profile) => {
      const matchesQuery =
        !term ||
        profile.displayName.toLowerCase().includes(term) ||
        profile.city.toLowerCase().includes(term) ||
        profile.profession.toLowerCase().includes(term) ||
        profile.id.toLowerCase().includes(term)
      const matchesStatus = status === 'all' || profile.status === status
      const matchesReview = review === 'all' || profile.reviewStatus === review
      return matchesQuery && matchesStatus && matchesReview
    })
  }, [adminProfiles, query, review, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const reviewTabs = [
    { value: 'all', label: 'All', count: adminProfiles.length },
    {
      value: 'pending',
      label: 'Pending',
      count: adminProfiles.filter((profile) => profile.reviewStatus === 'pending').length,
    },
    {
      value: 'approved',
      label: 'Approved',
      count: adminProfiles.filter((profile) => profile.reviewStatus === 'approved').length,
    },
    {
      value: 'changes-requested',
      label: 'Changes',
      count: adminProfiles.filter((profile) => profile.reviewStatus === 'changes-requested').length,
    },
  ]

  function changeReview(value) {
    setReview(value)
    setPage(1)
  }

  function toggleVerification(profile) {
    verifyProfile(profile.id, !profile.verified)
    toast.success(
      profile.verified
        ? `${profile.displayName} is no longer marked as demo verified.`
        : `${profile.displayName} is now marked as demo verified.`,
    )
  }

  function approveReview(profile) {
    updateProfileOverride(profile.id, { reviewStatus: 'approved' })
    recordActivity({
      type: 'profile',
      text: 'Profile review approved',
      detail: `${profile.displayName} · ${profile.city}`,
    })
    toast.success(`${profile.displayName}'s sample profile was approved.`)
  }

  function requestChanges(profile) {
    updateProfileOverride(profile.id, { reviewStatus: 'changes-requested' })
    recordActivity({
      type: 'profile',
      text: 'Profile changes requested',
      detail: `${profile.displayName} · demo moderation`,
    })
    toast.info(`${profile.displayName} was marked as needing changes.`)
  }

  function confirmStatusChange() {
    if (!pendingAction) return
    const { profile, nextStatus } = pendingAction
    setProfileStatus(profile.id, nextStatus)
    toast.success(
      nextStatus === 'suspended'
        ? `${profile.displayName} was suspended in the demo.`
        : `${profile.displayName} was restored to active.`,
    )
    setPendingAction(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Profiles"
        title="Profile management"
        description="Review new sample profiles, toggle demo verification and simulate account moderation. Nothing here affects real people."
        actions={
          <Button to="/admin/reports" variant="secondary" size="sm">
            Open reports
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <Badge tone="warning" size="sm">Simulated moderation</Badge>
        <span>{adminProfiles.length} sample profiles</span>
        <span aria-hidden="true">·</span>
        <span>{adminProfiles.filter((profile) => profile.reviewStatus === 'pending').length} awaiting review</span>
      </div>

      <div className="card-surface mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Search profiles</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, city, profession or profile ID"
              className="pl-9"
            />
          </label>
          <SelectField
            label=""
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by account status"
          >
            <option value="all">All account statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </SelectField>
          <SelectField
            label=""
            value={review}
            onChange={(event) => changeReview(event.target.value)}
            aria-label="Filter by review status"
          >
            <option value="all">All review states</option>
            <option value="pending">Pending review</option>
            <option value="approved">Approved</option>
            <option value="changes-requested">Changes requested</option>
          </SelectField>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <Tabs tabs={reviewTabs} value={review} onChange={changeReview} ariaLabel="Review filters" />
          <p className="text-[11px] text-ink-muted">
            Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–
            {Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
          </p>
        </div>
      </div>

      {visible.length ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-line bg-bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] text-left text-sm">
                <thead className="border-b border-line bg-bg-secondary/60 text-[10px] uppercase tracking-wider text-ink-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Profile</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Location & work</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Activity</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Review</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((profile) => (
                    <tr key={profile.id} className="align-middle transition-colors hover:bg-bg-secondary/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={profile.primaryPhoto} name={profile.displayName} size="sm" />
                          <div className="min-w-0">
                            <Link
                              to={`/profile/${profile.id}`}
                              className="flex items-center gap-1 font-semibold text-ink-primary hover:text-brand"
                            >
                              {profile.displayName}
                              {profile.verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-success" aria-label="Demo verified" />
                              )}
                            </Link>
                            <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                              {profile.id} · {profile.gender} · {profile.age}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-ink-primary">{profile.profession}</p>
                        <p className="text-[11px] text-ink-muted">{profile.city}, {profile.state}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[11px] text-ink-secondary">Joined {formatDate(profile.joinedAt)}</p>
                        <p className="text-[10px] text-ink-muted">
                          {profile.lastActiveAt ? `Active ${relativeTime(profile.lastActiveAt)}` : 'No activity'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={profile.plan === 'premium' ? 'brand' : profile.plan === 'plus' ? 'accent' : 'neutral'}
                          size="sm"
                          className="capitalize"
                        >
                          {profile.plan || 'free'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={profile.status === 'active' ? 'success' : 'error'} size="sm" className="capitalize">
                          {profile.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={reviewTone[profile.reviewStatus] || 'neutral'} size="sm">
                          {reviewLabel[profile.reviewStatus] || profile.reviewStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {profile.reviewStatus === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => approveReview(profile)}
                                className="rounded-lg p-1.5 text-success transition-colors hover:bg-success/10"
                                title="Approve sample profile"
                                aria-label={`Approve ${profile.displayName}`}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestChanges(profile)}
                                className="rounded-lg p-1.5 text-warning transition-colors hover:bg-warning/10"
                                title="Request changes"
                                aria-label={`Request changes for ${profile.displayName}`}
                              >
                                <PenLine className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleVerification(profile)}
                            className={cn(
                              'rounded-lg p-1.5 transition-colors',
                              profile.verified
                                ? 'text-success hover:bg-success/10'
                                : 'text-ink-muted hover:bg-bg-secondary hover:text-success',
                            )}
                            title={profile.verified ? 'Remove demo verification' : 'Mark as demo verified'}
                            aria-label={profile.verified ? `Remove verification from ${profile.displayName}` : `Verify ${profile.displayName}`}
                          >
                            {profile.verified ? <ShieldCheck className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                profile,
                                nextStatus: profile.status === 'active' ? 'suspended' : 'active',
                              })
                            }
                            className={cn(
                              'rounded-lg p-1.5 transition-colors',
                              profile.status === 'active'
                                ? 'text-ink-muted hover:bg-error/10 hover:text-error'
                                : 'text-success hover:bg-success/10',
                            )}
                            title={profile.status === 'active' ? 'Suspend demo account' : 'Restore demo account'}
                            aria-label={profile.status === 'active' ? `Suspend ${profile.displayName}` : `Restore ${profile.displayName}`}
                          >
                            {profile.status === 'active' ? <Ban className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                          </button>
                          <Link
                            to={`/profile/${profile.id}`}
                            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-bg-secondary hover:text-brand"
                            title="Open public profile"
                            aria-label={`Open ${profile.displayName}'s public profile`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} className="mt-4" />
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No profiles match"
          description="Try a different search, account status or review filter."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery('')
                setStatus('all')
                setReview('all')
                setPage(1)
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.nextStatus === 'suspended' ? 'Suspend this demo profile?' : 'Restore this demo profile?'}
        description={
          pendingAction?.nextStatus === 'suspended'
            ? 'The sample profile will be marked as suspended in the admin data.'
            : 'The sample profile will be returned to active status.'
        }
        confirmLabel={pendingAction?.nextStatus === 'suspended' ? 'Suspend profile' : 'Restore profile'}
        tone={pendingAction?.nextStatus === 'suspended' ? 'danger' : 'warning'}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingAction(null)}
      >
        {pendingAction
          ? `${pendingAction.profile.displayName} (${pendingAction.profile.id}) is sample data. This action only updates local demo state.`
          : ''}
      </ConfirmDialog>
    </div>
  )
}
