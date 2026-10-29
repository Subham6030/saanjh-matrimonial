import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Flag,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { formatDateTime, relativeTime } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import {
  Avatar,
  Badge,
  EmptyState,
  PageHeader,
  StatCard,
  Tabs,
} from '../components/common/ui'
import { Input, TextareaField } from '../components/forms/FormControls'

const statusTone = {
  pending: 'warning',
  reviewed: 'brand',
  actioned: 'success',
}

const statusLabel = {
  pending: 'Awaiting review',
  reviewed: 'Reviewed',
  actioned: 'Action taken',
}

export default function Reports() {
  usePageMeta('Reports & moderation', 'Review sample profile reports in the Saanjh demo admin console.')
  const { reports, updateReport, recordActivity, getAdminProfile } = useAdmin()
  const toast = useToast()

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')

  const selected = reports.find((report) => report.id === selectedId) || null
  const selectedProfile = selected ? getAdminProfile(selected.profileId) : null

  const tabs = [
    { value: 'all', label: 'All', count: reports.length },
    { value: 'pending', label: 'Pending', count: reports.filter((report) => report.status === 'pending').length },
    { value: 'reviewed', label: 'Reviewed', count: reports.filter((report) => report.status === 'reviewed').length },
    { value: 'actioned', label: 'Actioned', count: reports.filter((report) => report.status === 'actioned').length },
  ]

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return reports.filter((report) => {
      const profile = getAdminProfile(report.profileId)
      const matchesStatus = filter === 'all' || report.status === filter
      const matchesQuery =
        !term ||
        report.reason.toLowerCase().includes(term) ||
        report.reporterName.toLowerCase().includes(term) ||
        report.details.toLowerCase().includes(term) ||
        (profile?.displayName || '').toLowerCase().includes(term)
      return matchesStatus && matchesQuery
    })
  }, [filter, getAdminProfile, query, reports])

  function openReport(report) {
    setSelectedId(report.id)
    setNote(report.note || '')
    setNoteError('')
  }

  function closeReport() {
    setSelectedId(null)
    setNote('')
    setNoteError('')
  }

  function resolveReport(status) {
    if (!selected) return
    if (status === 'actioned' && !note.trim()) {
      setNoteError('Add a short moderation note before recording an action.')
      return
    }
    updateReport(selected.id, { status, note: note.trim() })
    recordActivity({
      type: 'report',
      text: status === 'actioned' ? 'Moderation action recorded' : 'Report marked as reviewed',
      detail: `${selectedProfile?.displayName || selected.profileId} · ${selected.reason}`,
    })
    toast.success(
      status === 'actioned'
        ? 'The sample report was marked as actioned.'
        : 'The sample report was marked as reviewed.',
    )
    closeReport()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Moderation"
        title="Reports & moderation"
        description="Review sample reports about fictional profiles. This queue demonstrates a workflow; it does not perform real moderation."
        actions={
          <Button to="/admin/profiles" variant="secondary" size="sm">
            Manage profiles
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Flag} label="Total reports" value={reports.length} helper="All sample reports in this browser." tone="neutral" />
        <StatCard
          icon={Clock}
          label="Awaiting review"
          value={reports.filter((report) => report.status === 'pending').length}
          helper="Reports that still need a moderator decision."
          tone="warning"
        />
        <StatCard
          icon={ShieldCheck}
          label="Reviewed"
          value={reports.filter((report) => report.status === 'reviewed').length}
          helper="Sample reports with a recorded note."
          tone="brand"
        />
        <StatCard
          icon={CheckCircle2}
          label="Action taken"
          value={reports.filter((report) => report.status === 'actioned').length}
          helper="Simulated moderation outcomes."
          tone="success"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={tabs} value={filter} onChange={setFilter} ariaLabel="Report filters" />
        <label className="relative block sm:w-72">
          <span className="sr-only">Search reports</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reason, member or reporter"
            className="pl-9"
          />
        </label>
      </div>

      {filtered.length ? (
        <div className="mt-4 space-y-2">
          {filtered.map((report) => {
            const profile = getAdminProfile(report.profileId)
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => openReport(report)}
                className="card-surface card-hover flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
                  <Flag className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink-primary">{report.reason}</span>
                    <Badge tone={statusTone[report.status] || 'neutral'} size="sm">
                      {statusLabel[report.status] || report.status}
                    </Badge>
                  </span>
                  <span className="mt-1 block truncate text-xs text-ink-secondary">
                    {profile?.displayName || report.profileId} · {report.details}
                  </span>
                  <span className="mt-1 block text-[10px] text-ink-muted">
                    Reported by {report.reporterName} · {relativeTime(report.createdAt)} · {report.id}
                  </span>
                </span>
                <span className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <Avatar src={profile?.primaryPhoto} name={profile?.displayName} size="sm" />
                  <span className="text-[10px] text-ink-muted">Open report</span>
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShieldAlert}
          title="No reports match"
          description="Try a different status filter or search term."
          className="mt-4"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFilter('all')
                setQuery('')
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}

      <Modal
        open={Boolean(selected)}
        onClose={closeReport}
        size="lg"
        title={selected?.reason || 'Report details'}
        description={
          selected
            ? `${selected.id} · submitted ${formatDateTime(selected.createdAt)} · ${selected.reporterName}`
            : ''
        }
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeReport}>
              Close
            </Button>
            <Button variant="secondary" size="sm" onClick={() => resolveReport('reviewed')}>
              Mark reviewed
            </Button>
            <Button size="sm" onClick={() => resolveReport('actioned')}>
              Record action taken
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={statusTone[selected.status] || 'neutral'} size="sm">
                {statusLabel[selected.status] || selected.status}
              </Badge>
              <Badge tone="warning" size="sm">Sample report</Badge>
            </div>

            <div className="rounded-xl border border-line bg-bg-secondary/40 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Reported profile</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar src={selectedProfile?.primaryPhoto} name={selectedProfile?.displayName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-primary">
                    {selectedProfile?.displayName || selected.profileId}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {selectedProfile?.profession} · {selectedProfile?.city} ·{' '}
                    {selectedProfile?.verified ? 'Demo verified' : 'Not verified'}
                  </p>
                </div>
                <Link
                  to={`/profile/${selected.profileId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  View <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">What was reported</p>
              <p className="mt-1.5 text-sm leading-7 text-ink-secondary">{selected.details}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">Reporter</p>
                <p className="mt-1 text-xs font-medium text-ink-primary">{selected.reporterName}</p>
              </div>
              <div className="rounded-lg border border-line p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">Last updated</p>
                <p className="mt-1 text-xs font-medium text-ink-primary">
                  {selected.updatedAt ? formatDateTime(selected.updatedAt) : 'Not yet reviewed'}
                </p>
              </div>
            </div>

            <TextareaField
              label="Moderation note"
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
                setNoteError('')
              }}
              error={noteError}
              hint="A note is required when recording an action. This is stored in local demo state."
              rows={3}
              placeholder="e.g. Sample reviewer asked for updated profile photos."
            />

            {selected.note && (
              <div className="rounded-lg border border-line bg-bg-secondary/40 p-3 text-xs leading-6 text-ink-secondary">
                <span className="font-semibold text-ink-primary">Existing note:</span> {selected.note}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
