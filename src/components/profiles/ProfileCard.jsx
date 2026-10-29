import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Bookmark,
  Check,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Ruler,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { heightLabel } from '../../utils/format'
import { primaryPhoto, profileAge, profileLocation } from '../../utils/profile'
import SmartImage from '../common/SmartImage'
import CompatibilityPill from './CompatibilityPill'

function InterestIcon({ status }) {
  if (status === 'accepted') return <MessageCircle className="h-4 w-4" aria-hidden="true" />
  if (status === 'pending') return <Clock className="h-4 w-4" aria-hidden="true" />
  if (status === 'declined') return <X className="h-4 w-4" aria-hidden="true" />
  return <Heart className="h-4 w-4" aria-hidden="true" />
}

function interestLabel(profile, interest, onMessage) {
  if (!interest) return `Express interest in ${profile.displayName}`
  if (interest.status === 'accepted')
    return onMessage ? `Message ${profile.displayName}` : `Connected with ${profile.displayName}`
  if (interest.status === 'pending')
    return interest.direction === 'incoming'
      ? `Respond to ${profile.displayName}'s interest`
      : `Interest sent to ${profile.displayName}`
  return `Interest with ${profile.displayName} is closed`
}

export default function ProfileCard({
  profile,
  match,
  isShortlisted = false,
  interest = null,
  onShortlist,
  onInterest,
  onMessage,
  onPass,
  showActions = true,
  className,
  imagePriority = false,
}) {
  const age = profileAge(profile)
  const location = profileLocation(profile)
  const common = match?.commonInterests || []
  const interestStatus = interest?.status || null

  const interestButtonClass =
    interestStatus === 'accepted'
      ? 'border-success/30 bg-success/10 text-success hover:bg-success/15'
      : interestStatus === 'pending'
        ? 'border-line bg-bg-secondary text-ink-muted'
        : interestStatus === 'declined'
          ? 'border-line bg-bg-secondary text-ink-muted'
          : 'border-brand/20 bg-brand/10 text-brand hover:bg-brand/15'

  return (
    <article className={cn('card-surface card-hover group overflow-hidden', className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
        <Link to={`/profile/${profile.id}`} aria-label={`View ${profile.displayName}'s profile`} className="block h-full w-full">
          <SmartImage
            src={primaryPhoto(profile)}
            alt={`${profile.displayName} — sample profile photo`}
            loading={imagePriority ? 'eager' : 'lazy'}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            fallbackLabel={profile.firstName?.charAt(0)}
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-primary/45 to-transparent" />
        <div className="absolute inset-x-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          <span className="whitespace-nowrap rounded-full bg-bg-card/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink-secondary shadow-soft backdrop-blur-sm">
            Sample profile
          </span>
          {profile.isNew && (
            <span className="whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-soft">
              New today
            </span>
          )}
          {profile.verified && (
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-bg-card/95 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-success shadow-soft backdrop-blur-sm">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              Demo verified
            </span>
          )}
          {match?.score !== undefined && (
            <div className="ml-auto shrink-0">
              <CompatibilityPill score={match.score} size="sm" />
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-white/90">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {location || 'Location shared privately'}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/profile/${profile.id}`}
              className="flex items-center gap-1.5 font-display text-xl text-ink-primary hover:text-brand"
            >
              <span className="truncate">{profile.displayName}</span>
              <span className="shrink-0 font-sans text-sm font-medium text-ink-muted">{age}</span>
            </Link>
            <p className="mt-1 truncate text-sm font-medium text-ink-secondary">{profile.profession}</p>
          </div>
          {onPass && (
            <button
              type="button"
              onClick={() => onPass(profile)}
              className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-error/10 hover:text-error"
              aria-label={`Pass on ${profile.displayName}`}
              title="Pass"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
          {profile.education && (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              {profile.education}
            </span>
          )}
          {profile.heightCm && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
              {heightLabel(profile.heightCm)}
            </span>
          )}
        </div>

        {common.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {common.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-ink-secondary"
              >
                <Sparkles className="h-2.5 w-2.5 text-brand" aria-hidden="true" />
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(profile.interests || []).slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-ink-secondary"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {interestStatus === 'pending' && interest?.direction === 'incoming' && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-brand">
            <Heart className="h-3 w-3" aria-hidden="true" /> This sample profile has expressed interest
          </p>
        )}

        {showActions && (
          <div className="mt-4 flex items-center gap-2">
            <Link
              to={`/profile/${profile.id}`}
              className="btn-secondary flex-1 px-3 py-2 text-xs"
            >
              View profile
            </Link>
            <button
              type="button"
              onClick={() => {
                if (interestStatus === 'accepted' && onMessage) {
                  onMessage(profile)
                } else {
                  onInterest?.(profile)
                }
              }}
              disabled={
                interestStatus === 'declined' ||
                (interestStatus === 'pending' && interest?.direction === 'outgoing')
              }
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-70',
                interestButtonClass,
              )}
              aria-label={interestLabel(profile, interest, onMessage)}
              title={interestLabel(profile, interest, onMessage)}
              aria-pressed={Boolean(interestStatus)}
            >
              <InterestIcon status={interestStatus} />
            </button>
            <button
              type="button"
              onClick={() => onShortlist?.(profile)}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors',
                isShortlisted
                  ? 'border-brand/30 bg-brand/10 text-brand'
                  : 'border-line bg-bg-card text-ink-muted hover:border-brand/30 hover:text-brand',
              )}
              aria-label={
                isShortlisted
                  ? `Remove ${profile.displayName} from shortlist`
                  : `Shortlist ${profile.displayName}`
              }
              title={isShortlisted ? 'Remove from shortlist' : 'Shortlist'}
              aria-pressed={isShortlisted}
            >
              {isShortlisted ? (
                <Bookmark className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Bookmark className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        {interestStatus === 'accepted' && onMessage && (
          <button
            type="button"
            onClick={() => onMessage(profile)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-[11px] font-semibold text-success transition-colors hover:bg-success/15"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Connected — open conversation
          </button>
        )}
      </div>
    </article>
  )
}
