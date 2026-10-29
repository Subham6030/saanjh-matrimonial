import { useMemo, useState } from 'react'
import { Clock, MapPin, Search, SlidersHorizontal, Sparkles, Users } from 'lucide-react'
import { computeCompatibility, compareSort, strictMismatch } from '../utils/compatibility'
import { usePageMeta } from '../hooks/usePageMeta'
import { useMatch } from '../context/MatchContext'
import { useProfile } from '../context/ProfileContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { profiles, featuredProfiles } from '../data/profiles'
import { profileAge, profileLocation } from '../utils/profile'
import { sortOptions } from '../data/options'
import Button from '../components/common/Button'
import ProfileCard from '../components/profiles/ProfileCard'
import ProfileGrid from '../components/profiles/ProfileGrid'
import { Badge, EmptyState, PageHeader, Tabs } from '../components/common/ui'
import { SelectField } from '../components/forms/FormControls'

const scoreFilters = [
  { value: 'all', label: 'Any score' },
  { value: '80', label: '80% and above' },
  { value: '90', label: '90% and above' },
]

export default function DiscoverMatches() {
  usePageMeta(
    'Discover matches',
    'Explore compatibility-led recommendations, new arrivals and nearby profiles in the Saanjh matrimonial demo.',
  )
  const { profile, preferences } = useProfile()
  const { passed, blocked } = useMatch()
  const { isShortlisted, getInterestFor, handleShortlist, handleInterest, handleMessage, handlePass } =
    useProfileActions()

  const [tab, setTab] = useState('recommended')
  const [sort, setSort] = useState('compatibility')
  const [minScore, setMinScore] = useState('all')

  const available = useMemo(
    () =>
      profiles.filter(
        (item) =>
          item.gender === preferences.lookingFor &&
          !passed.includes(item.id) &&
          !blocked.includes(item.id),
      ),
    [preferences.lookingFor, passed, blocked],
  )

  const recommended = useMemo(
    () =>
      available
        .map((item) => ({ ...item, match: computeCompatibility(item, profile, preferences) }))
        .filter((item) => item.match.strictPass),
    [available, profile, preferences],
  )

  const newProfiles = useMemo(
    () => available.filter((item) => item.isNew),
    [available],
  )

  const nearby = useMemo(
    () =>
      available.filter(
        (item) =>
          preferences.locations.includes(item.city) ||
          (profile.city && item.city === profile.city),
      ),
    [available, preferences.locations, profile.city],
  )

  const tabs = [
    { value: 'recommended', label: 'Recommended', count: recommended.length },
    { value: 'new', label: 'New today', count: newProfiles.length },
    { value: 'nearby', label: 'Near you', count: nearby.length },
    { value: 'all', label: 'Everyone', count: available.length },
  ]

  const visible = useMemo(() => {
    const tabLists = {
      recommended,
      new: newProfiles,
      nearby,
      all: available,
    }
    const list = tabLists[tab] || []
    const withMatch = list.map((item) => ({
      ...item,
      match: item.match || computeCompatibility(item, profile, preferences),
    }))
    const threshold = minScore === 'all' ? 0 : Number(minScore)
    const scored = withMatch.filter((item) => item.match.score >= threshold)
    const sorted = compareSort(scored, sort, profile, preferences)
    return sorted
  }, [tab, recommended, newProfiles, nearby, available, minScore, sort, profile, preferences])

  const activeTab = tabs.find((item) => item.value === tab)
  const averageScore = recommended.length
    ? Math.round(recommended.reduce((sum, item) => sum + item.match.score, 0) / recommended.length)
    : 0

  const showStrictNote =
    tab !== 'all' && available.some((item) => Boolean(strictMismatch(item, preferences)))

  return (
    <div>
      <PageHeader
        eyebrow="Your matches"
        title="People worth meeting"
        description={`Recommendations for ${profile.displayName || 'you'}, shaped by your preferences and the sample profiles available in this demo.`}
        actions={
          <>
            <Button to="/preferences" variant="secondary" size="sm" leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}>
              Preferences
            </Button>
            <Button to="/search" variant="secondary" size="sm" leftIcon={<Search className="h-3.5 w-3.5" />}>
              Search all
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand" size="sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> {recommended.length} recommendations
          </Badge>
          <Badge tone="neutral" size="sm">
            <Clock className="h-3 w-3" aria-hidden="true" /> {newProfiles.length} new today
          </Badge>
          <Badge tone="neutral" size="sm">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {nearby.length} near you
          </Badge>
          <Badge tone="success" size="sm">
            Average fit {averageScore}%
          </Badge>
        </div>
      </PageHeader>

      <div className="space-y-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Match categories" />

        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-primary">{activeTab?.label}</p>
            <p className="mt-0.5 text-xs leading-5 text-ink-secondary">
              {tab === 'recommended' && 'Profiles that pass your strict preferences, ordered by illustrative compatibility.'}
              {tab === 'new' && 'Members who joined most recently in this fictional sample set.'}
              {tab === 'nearby' && 'Profiles in your preferred cities or your current city.'}
              {tab === 'all' && 'Every sample profile that fits who you are looking for, including outside your strict filters.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              selectClassName="py-2 text-xs"
              className="min-w-[170px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Minimum compatibility"
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
              selectClassName="py-2 text-xs"
              className="min-w-[170px]"
            >
              {scoreFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        {showStrictNote && (
          <p className="text-xs leading-5 text-ink-muted">
            Some profiles in this view sit outside one of your strict filters. Switch to Recommended
            to see only profiles that pass every strict preference.
          </p>
        )}

        {visible.length ? (
          <>
            <ProfileGrid>
              {visible.map((item, index) => (
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
                  imagePriority={index < 3}
                />
              ))}
            </ProfileGrid>
            <p className="pt-1 text-center text-[11px] text-ink-muted">
              Showing {visible.length} sample {visible.length === 1 ? 'profile' : 'profiles'} ·{' '}
              {profileAge(profile) || '—'} year old {profile.gender} · {profileLocation(profile) || 'location not set'}
            </p>
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="No profiles in this view"
            description={
              tab === 'recommended'
                ? 'Your strict filters may be a little tight. Relax a preference or browse all profiles.'
                : minScore !== 'all'
                  ? 'No profiles meet that minimum compatibility score. Try a lower threshold.'
                  : 'There are no profiles here right now. Try another category.'
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {tab === 'recommended' && (
                  <Button to="/preferences" size="sm" leftIcon={<SlidersHorizontal className="h-4 w-4" />}>
                    Adjust preferences
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => setTab('all')}>
                  Browse everyone
                </Button>
              </div>
            }
          />
        )}
      </div>

      {featuredProfiles.length > 0 && (
        <p className="mt-6 text-center text-[11px] leading-5 text-ink-muted">
          All profiles, compatibility percentages and activity are fictional demo content. No real
          members are shown.
        </p>
      )}
    </div>
  )
}
