import { useMemo, useState } from 'react'
import { Bookmark, Search, Trash2 } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useMatch } from '../context/MatchContext'
import { useToast } from '../context/ToastContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { profiles } from '../data/profiles'
import Button from '../components/common/Button'
import ProfileCard from '../components/profiles/ProfileCard'
import ProfileGrid from '../components/profiles/ProfileGrid'
import { Badge, EmptyState, PageHeader } from '../components/common/ui'
import { ConfirmDialog } from '../components/common/Modal'

export default function ShortlistedProfiles() {
  usePageMeta(
    'Shortlisted profiles',
    'Your saved sample profiles in the Saanjh matrimonial demo.',
  )
  const { shortlist, removeShortlist } = useMatch()
  const { isShortlisted, getInterestFor, handleShortlist, handleInterest, handleMessage, handlePass } =
    useProfileActions()
  const toast = useToast()
  const [clearOpen, setClearOpen] = useState(false)

  const saved = useMemo(
    () =>
      shortlist
        .map((id) => profiles.find((profile) => profile.id === id))
        .filter(Boolean),
    [shortlist],
  )

  function clearAll() {
    shortlist.forEach((id) => removeShortlist(id))
    setClearOpen(false)
    toast.info('Your shortlist is now empty.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your shortlist"
        title="Profiles you saved"
        description="A quiet place to keep the people you would like to revisit. Nothing here is shared with anyone."
        actions={
          <>
            <Badge tone="brand" size="sm">
              <Bookmark className="h-3 w-3" aria-hidden="true" /> {saved.length} saved
            </Badge>
            {saved.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setClearOpen(true)}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Clear all
              </Button>
            )}
            <Button to="/search" size="sm" leftIcon={<Search className="h-3.5 w-3.5" />}>
              Find more
            </Button>
          </>
        }
      />

      {saved.length ? (
        <>
          <ProfileGrid>
            {saved.map((item) => (
              <ProfileCard
                key={item.id}
                profile={item}
                isShortlisted={isShortlisted(item.id)}
                interest={getInterestFor(item.id)}
                onShortlist={handleShortlist}
                onInterest={handleInterest}
                onMessage={handleMessage}
                onPass={handlePass}
              />
            ))}
          </ProfileGrid>
          <p className="mt-6 text-center text-[11px] leading-5 text-ink-muted">
            Tip: removing a profile from your shortlist never affects their interest in you. This is
            simulated demo data.
          </p>
        </>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="Your shortlist is waiting"
          description="Save profiles you would like to think about. Use the bookmark button on any profile card or profile page."
          action={
            <Button to="/search" leftIcon={<Search className="h-4 w-4" />}>
              Browse sample profiles
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={clearOpen}
        title="Clear your shortlist?"
        description="This removes every saved profile from this demo shortlist."
        confirmLabel="Clear shortlist"
        onConfirm={clearAll}
        onCancel={() => setClearOpen(false)}
      >
        You can always shortlist profiles again from search or your matches.
      </ConfirmDialog>
    </div>
  )
}
