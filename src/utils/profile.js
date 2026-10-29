import { calculateAge, heightLabel } from './format'

export const DEFAULT_STRICT = {
  age: true,
  maritalStatus: true,
  location: false,
  education: false,
  religion: false,
  languages: false,
  diet: false,
}

export const DEFAULT_PREFERENCES = {
  lookingFor: 'male',
  ageMin: 27,
  ageMax: 34,
  heightMin: 165,
  heightMax: 195,
  locations: [],
  education: [],
  professions: [],
  maritalStatuses: ['Never Married'],
  languages: [],
  religions: [],
  diets: [],
  smoking: '',
  drinking: '',
  strict: DEFAULT_STRICT,
}

export function normalizePreferences(preferences = {}) {
  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
    strict: { ...DEFAULT_STRICT, ...(preferences.strict || {}) },
    locations: preferences.locations || [],
    education: preferences.education || [],
    professions: preferences.professions || [],
    maritalStatuses: preferences.maritalStatuses || DEFAULT_PREFERENCES.maritalStatuses,
    languages: preferences.languages || [],
    religions: preferences.religions || [],
    diets: preferences.diets || [],
  }
}

export function displayName(profile) {
  if (!profile) return ''
  return profile.displayName || [profile.firstName, profile.lastName].filter(Boolean).join(' ')
}

export function profileAge(profile) {
  if (!profile) return null
  return profile.age || calculateAge(profile.dob)
}

export function profileLocation(profile) {
  if (!profile) return ''
  return [profile.city, profile.state].filter(Boolean).join(', ') || profile.country || ''
}

export function profileHeight(profile) {
  return heightLabel(profile?.heightCm)
}

export function primaryPhoto(profile) {
  if (!profile) return ''
  return profile.primaryPhoto || profile.photos?.[0] || ''
}

export function profileCompleteness(profile) {
  if (!profile) return { percent: 0, missing: [], complete: 0, total: 0 }
  const checks = [
    { label: 'Display name', done: Boolean(profile.firstName || profile.displayName) },
    { label: 'Profile headline', done: Boolean(profile.headline) },
    { label: 'Education', done: Boolean(profile.education) },
    { label: 'Profession', done: Boolean(profile.profession) },
    { label: 'A short biography', done: Boolean(profile.bio && profile.bio.length >= 40) },
    { label: 'Height', done: Boolean(profile.heightCm) },
    { label: 'Languages', done: (profile.languages || []).length > 0 },
    { label: 'Interests', done: (profile.interests || []).length >= 2 },
    { label: 'Location', done: Boolean(profile.city) },
    { label: 'Community', done: Boolean(profile.religion) },
    { label: 'Profile photo', done: (profile.photos || []).length > 0 },
    { label: 'Family details', done: Boolean(profile.family?.type) },
  ]
  const complete = checks.filter((check) => check.done).length
  const total = checks.length
  return {
    percent: Math.round((complete / total) * 100),
    missing: checks.filter((check) => !check.done).map((check) => check.label),
    complete,
    total,
  }
}

export function isLoggedInProfileComplete(profile) {
  return profileCompleteness(profile).percent >= 70
}

export function emptyProfileFromUser(user) {
  return {
    id: user?.id || 'me',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    displayName: user?.name || '',
    gender: user?.gender || 'female',
    dob: user?.dob || '',
    age: calculateAge(user?.dob),
    maritalStatus: 'Never Married',
    managedBy: user?.profileFor || 'Self',
    headline: '',
    education: '',
    profession: '',
    professionCategory: '',
    company: '',
    income: '',
    heightCm: '',
    languages: [],
    interests: [],
    diet: '',
    smoking: '',
    drinking: '',
    bio: '',
    family: { type: '', values: '', location: '', about: '' },
    country: 'India',
    state: '',
    city: '',
    religion: '',
    community: '',
    photos: [],
    primaryPhoto: '',
    privacy: {
      showIncome: true,
      showFamily: true,
      showLifestyle: true,
      showPreferences: true,
    },
    createdAt: new Date().toISOString(),
  }
}

export function matchingInterests(a, b) {
  const listA = a || []
  const listB = b || []
  return listA.filter((item) => listB.includes(item))
}

export function parseHeight(value) {
  return Number(value) || 0
}

export function buildProfileSummary(profile) {
  return {
    id: profile.id,
    displayName: displayName(profile),
    age: profileAge(profile),
    city: profile.city,
    state: profile.state,
    profession: profile.profession,
    education: profile.education,
    photo: primaryPhoto(profile),
  }
}
