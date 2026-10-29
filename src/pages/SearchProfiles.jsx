import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Search, SlidersHorizontal, Users } from 'lucide-react'
import { computeCompatibility, compareSort } from '../utils/compatibility'
import { profileAge } from '../utils/profile'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../context/ProfileContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { profiles } from '../data/profiles'
import { sortOptions } from '../data/options'
import Button from '../components/common/Button'
import Drawer from '../components/common/Drawer'
import ProfileCard from '../components/profiles/ProfileCard'
import ProfileGrid from '../components/profiles/ProfileGrid'
import SearchFilters, { EMPTY_SEARCH_FILTERS } from '../components/profiles/SearchFilters'
import { Badge, EmptyState, PageHeader, Pagination } from '../components/common/ui'
import { Input, SelectField } from '../components/forms/FormControls'

const PAGE_SIZE = 9

function filtersFromParams(params) {
  const next = {}
  const gender = params.get('gender') || params.get('lookingFor')
  if (gender) next.gender = gender
  for (const key of ['ageMin', 'ageMax', 'heightMin', 'heightMax', 'city', 'religion', 'education', 'profession', 'maritalStatus', 'language', 'q']) {
    if (params.has(key)) next[key] = params.get(key) || ''
  }
  return next
}

function matchesQuery(profile, query) {
  const term = query.trim().toLowerCase()
  if (!term) return true
  return [profile.displayName, profile.profession, profile.city, profile.headline, profile.community]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(term))
}

export default function SearchProfiles() {
  usePageMeta(
    'Search profiles',
    'Search sample profiles by name, age, city, community, education, profession and lifestyle in the Saanjh demo.',
  )
  const { profile, preferences } = useProfile()
  const { isShortlisted, getInterestFor, handleShortlist, handleInterest, handleMessage, handlePass } =
    useProfileActions()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryString = searchParams.toString()

  const [filters, setFilters] = useState(() => ({
    ...EMPTY_SEARCH_FILTERS,
    ...filtersFromParams(new URLSearchParams(queryString)),
  }))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const incoming = filtersFromParams(new URLSearchParams(queryString))
    if (Object.keys(incoming).length) {
      setFilters((current) => ({ ...current, ...incoming }))
      setPage(1)
    }
  }, [queryString])

  function changeFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
    setPage(1)
  }

  function resetFilters() {
    setFilters({ ...EMPTY_SEARCH_FILTERS })
    setSearchParams({}, { replace: true })
    setPage(1)
    setFiltersOpen(false)
  }

  const activeFilterCount = [
    'gender',
    'ageMin',
    'ageMax',
    'heightMin',
    'heightMax',
    'city',
    'religion',
    'education',
    'profession',
    'maritalStatus',
    'language',
  ].filter((key) => Boolean(filters[key])).length

  const results = useMemo(() => {
    const filtered = profiles.filter((item) => {
      if (filters.gender && item.gender !== filters.gender) return false
      if (!matchesQuery(item, filters.q)) return false
      if (filters.ageMin && profileAge(item) < Number(filters.ageMin)) return false
      if (filters.ageMax && profileAge(item) > Number(filters.ageMax)) return false
      if (filters.heightMin && item.heightCm < Number(filters.heightMin)) return false
      if (filters.heightMax && item.heightCm > Number(filters.heightMax)) return false
      if (filters.city && item.city !== filters.city) return false
      if (filters.religion && item.religion !== filters.religion) return false
      if (filters.education && item.education !== filters.education) return false
      if (filters.maritalStatus && item.maritalStatus !== filters.maritalStatus) return false
      if (filters.language && !(item.languages || []).includes(filters.language)) return false
      if (filters.profession) {
        const categoryMatch = item.professionCategory === filters.profession
        const titleMatch = item.profession?.toLowerCase().includes(filters.profession.toLowerCase())
        if (!categoryMatch && !titleMatch) return false
      }
      return true
    })

    const scored = filtered.map((item) => ({
      ...item,
      match: computeCompatibility(item, profile, preferences),
    }))
    return compareSort(scored, filters.sort, profile, preferences)
  }, [filters, profile, preferences])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <PageHeader
        eyebrow="Discover"
        title="Search profiles"
        description="Browse the full sample directory. Refine by the details that matter, without the pressure of a perfect filter."
        actions={
          <Badge tone="neutral" size="sm">
            {profiles.length} sample profiles
          </Badge>
        }
      />

      <div className="card-surface mb-5 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="profile-search" className="sr-only">
              Search profiles by name or profession
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <Input
              id="profile-search"
              value={filters.q}
              onChange={(event) => changeFilter('q', event.target.value)}
              placeholder="Search by name, profession, city or headline…"
              className="pl-9"
            />
          </div>
          <Button
            variant="secondary"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-24 p-5">
            <SearchFilters
              filters={filters}
              onChange={changeFilter}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                {results.length} {results.length === 1 ? 'profile' : 'profiles'} found
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {filters.q ? `Matching “${filters.q}”` : 'All profiles are fictional sample data.'}
              </p>
            </div>
            <SelectField
              label="Sort by"
              value={filters.sort}
              onChange={(event) => changeFilter('sort', event.target.value)}
              selectClassName="py-2 text-xs"
              className="w-full sm:w-52"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          {pageItems.length ? (
            <>
              <ProfileGrid columns="compact">
                {pageItems.map((item, index) => (
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
                    imagePriority={index < 2}
                  />
                ))}
              </ProfileGrid>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={setPage}
                className="mt-6"
              />
            </>
          ) : (
            <EmptyState
              icon={Users}
              title="No profiles match those filters"
              description="Try broadening your search, removing a filter or searching with a different name."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetFilters}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Clear all filters
                </Button>
              }
            />
          )}

          {results.length > 0 && (
            <p className="mt-5 text-center text-[11px] text-ink-muted">
              Showing page {currentPage} of {totalPages} · Compatibility is an illustrative demo
              score, not a judgement of people.
            </p>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Refine results"
        width="max-w-sm"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={resetFilters}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
            <Button fullWidth onClick={() => setFiltersOpen(false)}>
              Show {results.length} results
            </Button>
          </div>
        }
      >
        <SearchFilters
          filters={filters}
          onChange={changeFilter}
          onReset={resetFilters}
          hideHeading
        />
      </Drawer>
    </div>
  )
}
