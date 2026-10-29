import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { demoMemberProfile, demoPreferences } from '../data/member'
import {
  DEFAULT_PREFERENCES,
  emptyProfileFromUser,
  normalizePreferences,
  profileAge,
  profileCompleteness,
} from '../utils/profile'

const ProfileContext = createContext(null)

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function defaultPreferencesFor(user) {
  if (user?.id === 'demo-member') return clone(demoPreferences)
  return normalizePreferences({
    ...DEFAULT_PREFERENCES,
    lookingFor: user?.gender === 'female' ? 'male' : user?.gender === 'male' ? 'female' : 'male',
    ageMin: 24,
    ageMax: 36,
    heightMin: 150,
    heightMax: 195,
    locations: [],
    maritalStatuses: ['Never Married'],
  })
}

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const owner = user?.id || 'guest'

  const profileInitial = useCallback(() => {
    if (user?.id === 'demo-member') return clone(demoMemberProfile)
    return emptyProfileFromUser(user)
  }, [user])

  const preferencesInitial = useCallback(() => defaultPreferencesFor(user), [user])

  const [profile, setProfile] = useLocalStorage(`saanjh.profile.${owner}`, profileInitial)
  const [preferences, setPreferences] = useLocalStorage(
    `saanjh.preferences.${owner}`,
    preferencesInitial,
  )

  const updateProfile = useCallback(
    (patch) => {
      setProfile((current) => ({
        ...current,
        ...(typeof patch === 'function' ? patch(current) : patch),
        updatedAt: new Date().toISOString(),
      }))
    },
    [setProfile],
  )

  const updatePrivacy = useCallback(
    (patch) => {
      setProfile((current) => ({
        ...current,
        privacy: { ...current.privacy, ...patch },
        updatedAt: new Date().toISOString(),
      }))
    },
    [setProfile],
  )

  const savePreferences = useCallback(
    (next) => {
      setPreferences(normalizePreferences(next))
    },
    [setPreferences],
  )

  const resetPreferences = useCallback(() => {
    const defaults = defaultPreferencesFor(user)
    setPreferences(defaults)
    return defaults
  }, [setPreferences, user])

  const resetProfile = useCallback(() => {
    if (user?.id === 'demo-member') {
      setProfile(clone(demoMemberProfile))
    } else {
      setProfile(emptyProfileFromUser(user))
    }
  }, [setProfile, user])

  const completeness = useMemo(() => profileCompleteness(profile), [profile])
  const age = useMemo(() => profileAge(profile), [profile])

  const value = useMemo(
    () => ({
      profile,
      preferences,
      completeness,
      age,
      updateProfile,
      updatePrivacy,
      savePreferences,
      resetPreferences,
      resetProfile,
    }),
    [
      profile,
      preferences,
      completeness,
      age,
      updateProfile,
      updatePrivacy,
      savePreferences,
      resetPreferences,
      resetProfile,
    ],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used inside ProfileProvider')
  return context
}
