import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMatch } from '../context/MatchContext'
import { useMessaging } from '../context/MessagingContext'
import { useToast } from '../context/ToastContext'

export function useProfileActions() {
  const { isAuthenticated } = useAuth()
  const { isShortlisted, toggleShortlist, getInterestFor, sendInterest, passProfile } = useMatch()
  const { ensureConversation } = useMessaging()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  function requireAuth() {
    if (isAuthenticated) return true
    toast.info('Sign in to save profiles, express interest and message connections.', {
      title: 'Demo sign-in required',
    })
    navigate('/login', {
      state: { from: `${location.pathname}${location.search}` },
    })
    return false
  }

  function handleShortlist(profile) {
    if (!requireAuth()) return
    const added = toggleShortlist(profile.id)
    if (added) {
      toast.success(`${profile.displayName} was added to your shortlist.`, {
        title: 'Shortlisted',
      })
    } else {
      toast.info(`${profile.displayName} was removed from your shortlist.`)
    }
  }

  function handleMessage(profile) {
    if (!requireAuth()) return
    const result = ensureConversation(profile.id)
    if (result.ok) {
      navigate(`/messages?c=${result.id}`)
    } else {
      toast.error(result.reason, { title: 'Messaging unavailable' })
    }
  }

  function handlePass(profile) {
    if (!requireAuth()) return
    passProfile(profile.id)
    toast.info(`${profile.displayName} was passed. You can reset demo data from settings.`)
  }

  function handleInterest(profile) {
    if (!requireAuth()) return
    const existing = getInterestFor(profile.id)
    if (existing?.status === 'accepted') {
      handleMessage(profile)
      return
    }
    if (existing?.status === 'pending' && existing.direction === 'incoming') {
      toast.info(`Open Interests to respond to ${profile.displayName}.`, {
        title: 'Interest received',
      })
      navigate('/interests')
      return
    }
    if (existing?.status === 'pending') {
      toast.info(`Your interest to ${profile.displayName} is already pending.`)
      return
    }
    if (existing?.status === 'declined') {
      toast.info('This interest has already been closed in the demo.')
      return
    }
    const result = sendInterest(profile.id)
    if (result.ok) {
      toast.success(
        `Interest sent to ${profile.displayName}. This is a simulated action and no message was delivered.`,
        { title: 'Interest expressed' },
      )
    } else {
      toast.info('That action is not available for this profile.')
    }
  }

  return {
    isAuthenticated,
    isShortlisted,
    getInterestFor,
    handleShortlist,
    handleInterest,
    handleMessage,
    handlePass,
  }
}
