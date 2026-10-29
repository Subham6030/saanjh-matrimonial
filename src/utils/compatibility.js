import { hashString } from './ids'
import { matchingInterests, normalizePreferences, profileAge } from './profile'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const LABELS = {
  age: 'Age preference',
  location: 'Location',
  community: 'Community',
  education: 'Education',
  languages: 'Languages',
  interests: 'Shared interests',
  lifestyle: 'Lifestyle',
  profession: 'Profession',
}

function ageScore(age, prefs) {
  const min = Number(prefs.ageMin) || 18
  const max = Number(prefs.ageMax) || 60
  if (!age) return 10
  if (age >= min && age <= max) return 25
  const gap = age < min ? min - age : age - max
  return clamp(25 - gap * 6, 0, 25)
}

function locationScore(profile, prefs) {
  if (!prefs.locations.length) return 10
  if (prefs.locations.includes(profile.city)) return 15
  const contextual = profile.state && prefs.locations.some((city) => String(city).includes(profile.state))
  return contextual ? 8 : 2
}

function communityScore(profile, prefs) {
  if (!prefs.religions.length) return 7
  return prefs.religions.includes(profile.religion) ? 10 : 1
}

function educationScore(profile, prefs) {
  if (!prefs.education.length) return 7
  return prefs.education.includes(profile.education) ? 10 : 4
}

function languageScore(profile, prefs) {
  if (!prefs.languages.length) return 7
  const shared = matchingInterests(profile.languages, prefs.languages)
  if (!shared.length) return 1
  return clamp((shared.length / Math.min(prefs.languages.length, 3)) * 10, 3, 10)
}

function interestScore(profile, member) {
  const common = matchingInterests(profile.interests, member?.interests)
  if (!member?.interests?.length) return 8
  return clamp((common.length / Math.min(member.interests.length, 4)) * 15, 3, 15)
}

function lifestyleScore(profile, prefs) {
  let score = 0
  if (prefs.diets.length) score += prefs.diets.includes(profile.diet) ? 6 : 2
  else score += 4
  if (!prefs.smoking || prefs.smoking === profile.smoking) score += 2
  if (!prefs.drinking || prefs.drinking === profile.drinking) score += 2
  return score
}

function professionScore(profile, prefs) {
  if (!prefs.professions.length) return 3.5
  const matches = prefs.professions.some(
    (item) => item === profile.profession || item === profile.professionCategory,
  )
  return matches ? 5 : 1
}

export function strictMismatch(profile, preferences) {
  const prefs = normalizePreferences(preferences)
  const strict = prefs.strict || {}
  const age = profileAge(profile)

  if (strict.age && age && (age < prefs.ageMin || age > prefs.ageMax)) return 'Age'
  if (
    strict.maritalStatus &&
    prefs.maritalStatuses.length &&
    !prefs.maritalStatuses.includes(profile.maritalStatus)
  )
    return 'Marital status'
  if (strict.location && prefs.locations.length && !prefs.locations.includes(profile.city))
    return 'Location'
  if (strict.religion && prefs.religions.length && !prefs.religions.includes(profile.religion))
    return 'Community'
  if (strict.education && prefs.education.length && !prefs.education.includes(profile.education))
    return 'Education'
  if (
    strict.languages &&
    prefs.languages.length &&
    !matchingInterests(profile.languages, prefs.languages).length
  )
    return 'Languages'
  if (strict.diet && prefs.diets.length && !prefs.diets.includes(profile.diet)) return 'Lifestyle'
  return null
}

export function computeCompatibility(profile, member, preferences) {
  const prefs = normalizePreferences(preferences)
  const age = profileAge(profile)
  const commonInterests = matchingInterests(profile.interests, member?.interests)
  const breakdown = [
    { key: 'age', label: LABELS.age, earned: ageScore(age, prefs), max: 25 },
    { key: 'location', label: LABELS.location, earned: locationScore(profile, prefs), max: 15 },
    { key: 'community', label: LABELS.community, earned: communityScore(profile, prefs), max: 10 },
    { key: 'education', label: LABELS.education, earned: educationScore(profile, prefs), max: 10 },
    { key: 'languages', label: LABELS.languages, earned: languageScore(profile, prefs), max: 10 },
    { key: 'interests', label: LABELS.interests, earned: interestScore(profile, member), max: 15 },
    { key: 'lifestyle', label: LABELS.lifestyle, earned: lifestyleScore(profile, prefs), max: 10 },
    { key: 'profession', label: LABELS.profession, earned: professionScore(profile, prefs), max: 5 },
  ]
  const base = breakdown.reduce((sum, item) => sum + item.earned, 0)
  const variance = (hashString(profile.id) % 5) - 2
  const score = Math.round(clamp(base + variance, 42, 98))
  const mismatch = strictMismatch(profile, prefs)

  return {
    score,
    breakdown: breakdown.map((item) => ({
      ...item,
      earned: Math.round(item.earned * 10) / 10,
      percent: Math.round((item.earned / item.max) * 100),
    })),
    commonInterests,
    strictPass: !mismatch,
    strictMismatch: mismatch,
  }
}

export function rankProfiles(profiles, member, preferences, { excludeIds = [], respectStrict = true } = {}) {
  return profiles
    .filter((profile) => !excludeIds.includes(profile.id))
    .map((profile) => ({ ...profile, match: computeCompatibility(profile, member, preferences) }))
    .filter((profile) => (respectStrict ? profile.match.strictPass : true))
    .sort((a, b) => b.match.score - a.match.score)
}

export function compareSort(profiles, sort, member, preferences) {
  const list = [...profiles]
  if (sort === 'age-asc') return list.sort((a, b) => profileAge(a) - profileAge(b))
  if (sort === 'age-desc') return list.sort((a, b) => profileAge(b) - profileAge(a))
  if (sort === 'newest')
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  return list
    .map((profile) => ({ ...profile, match: computeCompatibility(profile, member, preferences) }))
    .sort((a, b) => b.match.score - a.match.score)
}
