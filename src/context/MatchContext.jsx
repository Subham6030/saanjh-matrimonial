import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { seedInterests } from '../data/interests'
import { createId } from '../utils/ids'

const MatchContext = createContext(null)

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function MatchProvider({ children }) {
  const { user } = useAuth()
  const owner = user?.id || 'guest'

  const seedForUser = useCallback(
    (value) => (user ? clone(value) : []),
    [user],
  )

  const [shortlist, setShortlist] = useLocalStorage(
    `saanjh.shortlist.${owner}`,
    () => seedForUser(['p1', 'p3', 'p14']),
  )
  const [interests, setInterests] = useLocalStorage(
    `saanjh.interests.${owner}`,
    () => seedForUser(seedInterests),
  )
  const [passed, setPassed] = useLocalStorage(`saanjh.passed.${owner}`, [])
  const [blocked, setBlocked] = useLocalStorage(`saanjh.blocked.${owner}`, [])

  const isShortlisted = useCallback(
    (profileId) => shortlist.includes(profileId),
    [shortlist],
  )

  const toggleShortlist = useCallback(
    (profileId) => {
      let added = false
      setShortlist((current) => {
        if (current.includes(profileId)) return current.filter((id) => id !== profileId)
        added = true
        return [...current, profileId]
      })
      return added
    },
    [setShortlist],
  )

  const removeShortlist = useCallback(
    (profileId) => setShortlist((current) => current.filter((id) => id !== profileId)),
    [setShortlist],
  )

  const getInterestFor = useCallback(
    (profileId) => interests.find((interest) => interest.profileId === profileId) || null,
    [interests],
  )

  const sendInterest = useCallback(
    (profileId, note = '') => {
      const existing = interests.find((interest) => interest.profileId === profileId)
      if (existing) {
        if (existing.status === 'accepted') return { ok: false, reason: 'already-connected', existing }
        if (existing.status === 'pending') {
          return {
            ok: false,
            reason: existing.direction === 'incoming' ? 'incoming-pending' : 'already-sent',
            existing,
          }
        }
        return { ok: false, reason: 'already-responded', existing }
      }
      const record = {
        id: createId('interest'),
        profileId,
        direction: 'outgoing',
        status: 'pending',
        createdAt: new Date().toISOString(),
        note,
      }
      setInterests((current) => [record, ...current])
      return { ok: true, record }
    },
    [interests, setInterests],
  )

  const acceptInterest = useCallback(
    (interestId) => {
      let accepted = null
      setInterests((current) =>
        current.map((interest) => {
          if (interest.id !== interestId) return interest
          accepted = { ...interest, status: 'accepted', respondedAt: new Date().toISOString() }
          return accepted
        }),
      )
      return accepted
    },
    [setInterests],
  )

  const declineInterest = useCallback(
    (interestId) => {
      setInterests((current) =>
        current.map((interest) =>
          interest.id === interestId
            ? { ...interest, status: 'declined', respondedAt: new Date().toISOString() }
            : interest,
        ),
      )
    },
    [setInterests],
  )

  const passProfile = useCallback(
    (profileId) => {
      setPassed((current) => (current.includes(profileId) ? current : [...current, profileId]))
    },
    [setPassed],
  )

  const blockProfile = useCallback(
    (profileId) => {
      setBlocked((current) => (current.includes(profileId) ? current : [...current, profileId]))
      setShortlist((current) => current.filter((id) => id !== profileId))
    },
    [setBlocked, setShortlist],
  )

  const unblockProfile = useCallback(
    (profileId) => setBlocked((current) => current.filter((id) => id !== profileId)),
    [setBlocked],
  )

  const isBlocked = useCallback((profileId) => blocked.includes(profileId), [blocked])

  const receivedInterests = useMemo(
    () => interests.filter((interest) => interest.direction === 'incoming'),
    [interests],
  )
  const sentInterests = useMemo(
    () => interests.filter((interest) => interest.direction === 'outgoing'),
    [interests],
  )
  const pendingReceived = useMemo(
    () => receivedInterests.filter((interest) => interest.status === 'pending'),
    [receivedInterests],
  )
  const acceptedInterests = useMemo(
    () => interests.filter((interest) => interest.status === 'accepted'),
    [interests],
  )
  const acceptedProfileIds = useMemo(
    () => acceptedInterests.map((interest) => interest.profileId),
    [acceptedInterests],
  )
  const incomingPendingProfileIds = useMemo(
    () =>
      receivedInterests
        .filter((interest) => interest.status === 'pending')
        .map((interest) => interest.profileId),
    [receivedInterests],
  )

  const hasAcceptedInterest = useCallback(
    (profileId) => acceptedProfileIds.includes(profileId),
    [acceptedProfileIds],
  )

  const hasIncomingPending = useCallback(
    (profileId) => incomingPendingProfileIds.includes(profileId),
    [incomingPendingProfileIds],
  )

  const resetMatches = useCallback(() => {
    setShortlist(user ? ['p1', 'p3', 'p14'] : [])
    setInterests(user ? clone(seedInterests) : [])
    setPassed([])
    setBlocked([])
  }, [setBlocked, setInterests, setPassed, setShortlist, user])

  const value = useMemo(
    () => ({
      shortlist,
      interests,
      receivedInterests,
      sentInterests,
      pendingReceived,
      acceptedInterests,
      acceptedProfileIds,
      passed,
      blocked,
      isShortlisted,
      toggleShortlist,
      removeShortlist,
      getInterestFor,
      sendInterest,
      acceptInterest,
      declineInterest,
      passProfile,
      blockProfile,
      unblockProfile,
      isBlocked,
      hasAcceptedInterest,
      hasIncomingPending,
      resetMatches,
    }),
    [
      shortlist,
      interests,
      receivedInterests,
      sentInterests,
      pendingReceived,
      acceptedInterests,
      acceptedProfileIds,
      passed,
      blocked,
      isShortlisted,
      toggleShortlist,
      removeShortlist,
      getInterestFor,
      sendInterest,
      acceptInterest,
      declineInterest,
      passProfile,
      blockProfile,
      unblockProfile,
      isBlocked,
      hasAcceptedInterest,
      hasIncomingPending,
      resetMatches,
    ],
  )

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
}

export function useMatch() {
  const context = useContext(MatchContext)
  if (!context) throw new Error('useMatch must be used inside MatchProvider')
  return context
}
