import { useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Briefcase,
  CalendarDays,
  Check,
  Clock,
  Flag,
  GraduationCap,
  Heart,
  Home,
  Languages,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Ruler,
  ShieldOff,
  Sparkles,
  Utensils,
  Users,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { computeCompatibility } from '../utils/compatibility'
import { formatDate, heightLabel, relativeTime } from '../utils/format'
import { primaryPhoto, profileAge, profileLocation } from '../utils/profile'
import { usePageMeta } from '../hooks/usePageMeta'
import { useClickOutside } from '../hooks/useClickOutside'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { useMatch } from '../context/MatchContext'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { getProfileById, profiles } from '../data/profiles'
import Button from '../components/common/Button'
import ProfileGallery from '../components/profiles/ProfileGallery'
import ProfileCard from '../components/profiles/ProfileCard'
import ProfileGrid from '../components/profiles/ProfileGrid'
import CompatibilityPill from '../components/profiles/CompatibilityPill'
import { Alert, Avatar, Badge, EmptyState, ProgressBar, ProgressRing, SectionHeading } from '../components/common/ui'
import Modal, { ConfirmDialog } from '../components/common/Modal'
import { SelectField, TextareaField } from '../components/forms/FormControls'

const reportReasons = [
  'Fake profile or impersonation',
  'Inappropriate photos or content',
  'Harassment or abusive behaviour',
  'Spam or a possible scam',
  'Something else',
]

const compatibilityKeys = ['age', 'community', 'interests', 'lifestyle']

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary text-ink-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-ink-primary">{value || 'Not shared'}</dd>
      </div>
    </div>
  )
}

export default function ProfileDetails() {
  const { id: routeId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { addReport } = useAdmin()
  const { profile, preferences } = useProfile()
  const { passed, blocked, isBlocked, blockProfile, unblockProfile } = useMatch()
  const { isShortlisted, getInterestFor, handleShortlist, handleInterest, handleMessage, handlePass } =
    useProfileActions()
  const toast = useToast()

  const id = routeId || (pathname === '/profile/me' ? 'me' : undefined)
  const isOwnRoute = id === 'me'
  const isOwn = isOwnRoute && isAuthenticated
  const displayProfile = isOwn ? profile : isOwnRoute ? null : getProfileById(id)

  usePageMeta(
    displayProfile ? `${displayProfile.displayName} · Sample profile` : 'Profile unavailable',
    displayProfile
      ? `View ${displayProfile.displayName}'s fictional profile on the Saanjh matrimonial demo.`
      : 'This sample profile could not be found.',
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reportError, setReportError] = useState('')
  const [blockOpen, setBlockOpen] = useState(false)
  const menuRef = useRef(null)
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen)

  const match = useMemo(
    () =>
      displayProfile && isAuthenticated
        ? computeCompatibility(displayProfile, profile, preferences)
        : null,
    [displayProfile, isAuthenticated, profile, preferences],
  )

  const similar = useMemo(() => {
    if (!displayProfile) return []
    return profiles
      .filter(
        (item) =>
          item.id !== displayProfile.id &&
          item.gender === displayProfile.gender &&
          !passed.includes(item.id) &&
          !blocked.includes(item.id),
      )
      .map((item) => {
        const sharedInterests = (item.interests || []).filter((interest) =>
          (displayProfile.interests || []).includes(interest),
        ).length
        const sameCity = item.city && item.city === displayProfile.city ? 2 : 0
        return {
          ...item,
          match: isAuthenticated ? computeCompatibility(item, profile, preferences) : null,
          relevance: sharedInterests + sameCity,
        }
      })
      .sort((a, b) => b.relevance - a.relevance || (b.match?.score || 0) - (a.match?.score || 0))
      .slice(0, 3)
  }, [displayProfile, isAuthenticated, profile, preferences, passed, blocked])

  if (isOwnRoute && !isAuthenticated) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Users}
          title="Sign in to see your profile"
          description="Your Saanjh profile lives inside the demo member area."
          action={
            <Button to="/login" size="sm">
              Sign in to the demo
            </Button>
          }
        />
      </div>
    )
  }

  if (!displayProfile) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Users}
          title="This profile could not be found"
          description="The sample profile may have moved or never existed. Explore the full fictional directory instead."
          action={
            <Button to="/search" size="sm">
              Browse profiles
            </Button>
          }
        />
      </div>
    )
  }

  const age = profileAge(displayProfile)
  const location = profileLocation(displayProfile)
  const interest = getInterestFor(displayProfile.id)
  const blockedProfile = isBlocked(displayProfile.id)
  const isPremium = displayProfile.plan === 'premium'
  const commonInterests = match?.commonInterests || []
  const showFamily =
    displayProfile.privacy?.showFamily !== false && displayProfile.familyVisible !== false
  const showIncome = displayProfile.privacy?.showIncome !== false

  function submitReport() {
    if (!reportReason) {
      setReportError('Please choose a reason for the report.')
      return
    }
    addReport({
      profileId: displayProfile.id,
      reason: reportReason,
      details: reportDetails.trim() || 'No additional details were provided.',
      reporterName: user?.name || 'Demo member',
    })
    setReportOpen(false)
    setReportReason('')
    setReportDetails('')
    setReportError('')
    toast.success('Your report has been recorded for this demo. No real moderation action occurs.', {
      title: 'Report submitted',
    })
  }

  function confirmBlock() {
    blockProfile(displayProfile.id)
    setBlockOpen(false)
    toast.info(`${displayProfile.displayName} was blocked and removed from your suggestions.`)
    navigate('/matches')
  }

  let primaryAction
  if (isOwn) {
    primaryAction = (
      <Button to="/profile/edit" leftIcon={<Sparkles className="h-4 w-4" />}>
        Edit profile
      </Button>
    )
  } else if (interest?.status === 'accepted') {
    primaryAction = (
      <Button onClick={() => handleMessage(displayProfile)} leftIcon={<MessageCircle className="h-4 w-4" />}>
        Message
      </Button>
    )
  } else if (interest?.status === 'pending' && interest.direction === 'incoming') {
    primaryAction = (
      <Button onClick={() => handleInterest(displayProfile)} leftIcon={<Heart className="h-4 w-4" />}>
        Respond to interest
      </Button>
    )
  } else if (interest?.status === 'pending') {
    primaryAction = (
      <Button disabled leftIcon={<Clock className="h-4 w-4" />}>
        Interest pending
      </Button>
    )
  } else if (interest?.status === 'declined') {
    primaryAction = (
      <Button variant="secondary" disabled>
        Interest closed
      </Button>
    )
  } else {
    primaryAction = (
      <Button onClick={() => handleInterest(displayProfile)} leftIcon={<Heart className="h-4 w-4" />}>
        Express interest
      </Button>
    )
  }

  return (
    <div className="container-page py-6 sm:py-8">
      <Link
        to={isOwn ? '/dashboard' : '/search'}
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {isOwn ? 'Back to dashboard' : 'Back to search'}
      </Link>

      {blockedProfile && (
        <Alert
          variant="warning"
          title="You have blocked this profile"
          className="mb-5"
          actions={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                unblockProfile(displayProfile.id)
                toast.success(`${displayProfile.displayName} was unblocked.`)
              }}
            >
              Unblock
            </Button>
          }
        >
          This profile is hidden from your matches. You can unblock it if you change your mind.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <ProfileGallery
            photos={displayProfile.photos || (displayProfile.primaryPhoto ? [displayProfile.primaryPhoto] : [])}
            name={displayProfile.displayName}
            verified={displayProfile.verified}
          />

          <div className="card-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Sample compatibility
              </p>
              {match && <CompatibilityPill score={match.score} size="sm" />}
            </div>

            {match ? (
              <>
                <div className="mt-4 flex items-center gap-4">
                  <ProgressRing value={match.score} size={92} />
                  <div className="min-w-0">
                    <p className="font-display text-xl text-ink-primary">
                      {match.score >= 85 ? 'A strong sample fit' : match.score >= 70 ? 'Some nice overlap' : 'Worth a closer look'}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink-secondary">
                      Based on preferences, lifestyle and shared interests. Illustrative only.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {match.breakdown
                    .filter((item) => compatibilityKeys.includes(item.key))
                    .map((item) => (
                      <div key={item.key}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                          <span className="text-ink-secondary">{item.label}</span>
                          <span className="font-semibold text-ink-primary">{item.percent}%</span>
                        </div>
                        <ProgressBar value={item.percent} size="sm" />
                      </div>
                    ))}
                </div>
                {commonInterests.length > 0 && (
                  <div className="mt-4 border-t border-line pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      Shared interests
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {commonInterests.slice(0, 5).map((item) => (
                        <Badge key={item} tone="brand" size="sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button to="/preferences" variant="ghost" size="sm" className="mt-3 px-2">
                  Adjust your preferences
                </Button>
              </>
            ) : (
              <div className="mt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink-primary">Curious how you fit?</p>
                <p className="mt-1 text-xs leading-5 text-ink-secondary">
                  Sign in to see an illustrative compatibility breakdown and save profiles you like.
                </p>
                <Button to="/login" size="sm" className="mt-3">
                  Sign in to see compatibility
                </Button>
              </div>
            )}
          </div>

          <div className="card-surface p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Member snapshot
            </p>
            <dl className="mt-2 divide-y divide-line/70">
              <DetailItem icon={CalendarDays} label="Member since" value={formatDate(displayProfile.joinedAt || displayProfile.createdAt)} />
              <DetailItem icon={Clock} label="Last active" value={relativeTime(displayProfile.lastActiveAt)} />
              <DetailItem icon={Home} label="Profile managed by" value={displayProfile.managedBy} />
            </dl>
          </div>

          {!isOwn && isAuthenticated && !blockedProfile && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="btn-ghost w-full justify-center text-xs"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                Safety options
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-line bg-bg-card p-1.5 shadow-lift animate-scale-in"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      setReportOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
                  >
                    <Flag className="h-4 w-4" aria-hidden="true" /> Report this profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      setBlockOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-error transition-colors hover:bg-error/10"
                  >
                    <ShieldOff className="h-4 w-4" aria-hidden="true" /> Block this profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <header className="card-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning" size="sm">Sample profile</Badge>
              {displayProfile.verified && (
                <Badge tone="success" size="sm">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Demo verified
                </Badge>
              )}
              {isPremium && <Badge tone="accent" size="sm">Premium sample</Badge>}
              {displayProfile.isNew && <Badge tone="brand" size="sm">New today</Badge>}
            </div>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <Avatar
                  src={primaryPhoto(displayProfile)}
                  name={displayProfile.displayName}
                  size="lg"
                  className="hidden sm:inline-flex"
                />
                <div className="min-w-0">
                  <h1 className="display-page text-ink-primary">{displayProfile.displayName}</h1>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm font-medium text-ink-secondary">
                    <span>{age} years</span>
                    <span aria-hidden="true">·</span>
                    <span>{displayProfile.profession}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {location || 'Location private'}
                    </span>
                  </p>
                  {displayProfile.headline && (
                    <p className="mt-2 text-sm leading-6 text-ink-secondary">{displayProfile.headline}</p>
                  )}
                </div>
              </div>

              {!blockedProfile && (
                <div className="flex flex-wrap items-center gap-2">
                  {primaryAction}
                  {!isOwn && (
                    <button
                      type="button"
                      onClick={() => handleShortlist(displayProfile)}
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors',
                        isShortlisted(displayProfile.id)
                          ? 'border-brand/30 bg-brand/10 text-brand'
                          : 'border-line bg-bg-card text-ink-muted hover:border-brand/30 hover:text-brand',
                      )}
                      aria-label={
                        isShortlisted(displayProfile.id)
                          ? `Remove ${displayProfile.displayName} from shortlist`
                          : `Shortlist ${displayProfile.displayName}`
                      }
                      aria-pressed={isShortlisted(displayProfile.id)}
                      title={isShortlisted(displayProfile.id) ? 'Remove from shortlist' : 'Shortlist'}
                    >
                      <Bookmark
                        className={cn('h-4 w-4', isShortlisted(displayProfile.id) && 'fill-current')}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
              )}
            </div>

            {!isAuthenticated && !isOwn && (
              <p className="mt-3 text-[11px] text-ink-muted">
                <Link to="/login" className="font-semibold text-brand hover:text-brand-hover">
                  Sign in
                </Link>{' '}
                to shortlist, express interest or message a connection.
              </p>
            )}
            {interest?.status === 'accepted' && !isOwn && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> You are connected. This demo conversation
                is simulated.
              </p>
            )}
            {interest?.status === 'pending' && !isOwn && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {interest.direction === 'incoming'
                  ? 'They have expressed interest in you.'
                  : 'Your interest is waiting for a response.'}
              </p>
            )}
          </header>

          <section className="card-surface p-5 sm:p-6">
            <h2 className="font-display text-xl text-ink-primary">In their own words</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-secondary">
              {displayProfile.bio || 'This sample profile has not added a biography yet.'}
            </p>
          </section>

          <section className="card-surface p-5 sm:p-6">
            <h2 className="font-display text-xl text-ink-primary">The essentials</h2>
            <dl className="mt-1 grid gap-x-6 sm:grid-cols-2">
              <DetailItem icon={Ruler} label="Height" value={heightLabel(displayProfile.heightCm)} />
              <DetailItem icon={Heart} label="Marital status" value={displayProfile.maritalStatus} />
              <DetailItem icon={GraduationCap} label="Education" value={[displayProfile.education, displayProfile.educationDetail].filter(Boolean).join(' · ')} />
              <DetailItem icon={Briefcase} label="Profession" value={[displayProfile.profession, displayProfile.company].filter(Boolean).join(' at ')} />
              <DetailItem icon={MapPin} label="Community" value={[displayProfile.religion, displayProfile.community].filter(Boolean).join(' · ')} />
              <DetailItem icon={Languages} label="Languages" value={(displayProfile.languages || []).join(', ')} />
              <DetailItem icon={Utensils} label="Diet" value={displayProfile.diet} />
              <DetailItem
                icon={Sparkles}
                label="Lifestyle"
                value={[displayProfile.smoking && `Smoking: ${displayProfile.smoking}`, displayProfile.drinking && `Drinking: ${displayProfile.drinking}`].filter(Boolean).join(' · ')}
              />
              <DetailItem icon={Home} label="Mother tongue" value={displayProfile.motherTongue} />
              {showIncome && (
                <DetailItem icon={Briefcase} label="Annual income" value={displayProfile.income} />
              )}
            </dl>
          </section>

          <section className="card-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl text-ink-primary">Interests & pastimes</h2>
              <Badge tone="neutral" size="sm">{(displayProfile.interests || []).length} interests</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(displayProfile.interests || []).map((item) => (
                <span
                  key={item}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
                    commonInterests.includes(item)
                      ? 'border-brand/25 bg-brand/10 text-brand'
                      : 'border-line bg-bg-secondary text-ink-secondary',
                  )}
                >
                  {commonInterests.includes(item) && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                  {item}
                </span>
              ))}
              {!displayProfile.interests?.length && (
                <p className="text-sm text-ink-muted">No interests added yet.</p>
              )}
            </div>
          </section>

          <section className="card-surface p-5 sm:p-6">
            <h2 className="font-display text-xl text-ink-primary">Family & roots</h2>
            {showFamily && displayProfile.family ? (
              <>
                <dl className="mt-1 grid gap-x-6 sm:grid-cols-2">
                  <DetailItem icon={Users} label="Family type" value={displayProfile.family.type} />
                  <DetailItem icon={Heart} label="Family values" value={displayProfile.family.values} />
                  <DetailItem icon={MapPin} label="Family location" value={displayProfile.family.location} />
                </dl>
                {displayProfile.family.about && (
                  <p className="mt-3 border-t border-line pt-4 text-sm leading-7 text-ink-secondary">
                    {displayProfile.family.about}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-ink-secondary">
                This member has chosen to keep their family details private in the demo.
              </p>
            )}
          </section>

          <div className="rounded-xl border border-warning/25 bg-warning/10 p-4 text-xs leading-6 text-ink-secondary">
            <p className="font-semibold text-warning">Sample profile notice</p>
            <p className="mt-0.5">
              {displayProfile.displayName} is a fictional profile created for this demonstration. The
              photo is illustrative stock imagery, and every detail is sample content.
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <SectionHeading
            eyebrow="Keep exploring"
            title="Similar sample profiles"
            description={`More fictional profiles with a little in common with ${displayProfile.firstName}.`}
          />
          <ProfileGrid columns="compact" className="mt-5">
            {similar.map((item) => (
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
              />
            ))}
          </ProfileGrid>
        </section>
      )}

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title={`Report ${displayProfile.displayName}`}
        description="This is a simulated safety flow. Nothing is sent to a real moderation team."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport} leftIcon={<Flag className="h-4 w-4" />}>
              Submit report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label="Reason for reporting"
            value={reportReason}
            onChange={(event) => {
              setReportReason(event.target.value)
              setReportError('')
            }}
            error={reportError}
            placeholder="Choose a reason"
            required
          >
            {reportReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </SelectField>
          <TextareaField
            label="Additional details"
            value={reportDetails}
            onChange={(event) => setReportDetails(event.target.value)}
            placeholder="Optional context for this demo report…"
            maxLength={400}
            hint="Do not enter real personal or sensitive information."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={blockOpen}
        title={`Block ${displayProfile.displayName}?`}
        description="They will be removed from your suggestions and shortlisted profiles in this demo."
        confirmLabel="Block profile"
        onConfirm={confirmBlock}
        onCancel={() => setBlockOpen(false)}
      >
        Blocking is reversible from this profile page if you visit it again.
      </ConfirmDialog>
    </div>
  )
}
