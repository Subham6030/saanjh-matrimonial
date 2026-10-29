import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { useMatch } from './MatchContext'
import { useNotifications } from './NotificationContext'
import { useSubscription } from './SubscriptionContext'
import { seedConversationData, demoReplies } from '../data/conversations'
import { getProfileById } from '../data/profiles'
import { createId } from '../utils/ids'

const MessagingContext = createContext(null)

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function lastMessage(conversation) {
  return conversation.messages?.[conversation.messages.length - 1] || null
}

export function MessagingProvider({ children }) {
  const { user } = useAuth()
  const { hasAcceptedInterest, hasIncomingPending } = useMatch()
  const { addNotification } = useNotifications()
  const { isPremium } = useSubscription()
  const owner = user?.id || 'guest'

  const seedConversations = useCallback(
    () => (user ? clone(seedConversationData) : []),
    [user],
  )

  const [conversations, setConversations] = useLocalStorage(
    `saanjh.conversations.${owner}`,
    seedConversations,
  )
  const [typingIds, setTypingIds] = useState([])
  const [activeConversationId, setActiveConversationIdState] = useState(null)
  const activeRef = useRef(null)
  const timers = useRef([])
  const notifyRef = useRef(addNotification)
  notifyRef.current = addNotification

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current = []
    },
    [],
  )

  const setActiveConversation = useCallback((id) => {
    activeRef.current = id
    setActiveConversationIdState(id)
    if (id) {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === id ? { ...conversation, unread: 0 } : conversation,
        ),
      )
    }
  }, [setConversations])

  const getConversation = useCallback(
    (id) => conversations.find((conversation) => conversation.id === id) || null,
    [conversations],
  )

  const getConversationByProfile = useCallback(
    (profileId) => conversations.find((conversation) => conversation.profileId === profileId) || null,
    [conversations],
  )

  const hasExistingConversation = useCallback(
    (profileId) => Boolean(getConversationByProfile(profileId)),
    [getConversationByProfile],
  )

  const canMessage = useCallback(
    (profileId) => {
      if (!profileId) return false
      if (hasExistingConversation(profileId)) return true
      if (hasAcceptedInterest(profileId)) return true
      if (isPremium && hasIncomingPending(profileId)) return true
      return false
    },
    [hasExistingConversation, hasAcceptedInterest, hasIncomingPending, isPremium],
  )

  const markRead = useCallback(
    (id) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === id ? { ...conversation, unread: 0 } : conversation,
        ),
      )
    },
    [setConversations],
  )

  const ensureConversation = useCallback(
    (profileId, { force = false } = {}) => {
      const existing = conversations.find((conversation) => conversation.profileId === profileId)
      if (existing) return { ok: true, id: existing.id, existing: true }
      if (!force && !canMessage(profileId)) {
        return {
          ok: false,
          reason: 'Messaging opens after an interest is accepted. Premium members can also reply to incoming interests.',
        }
      }
      const id = createId('conv')
      const conversation = {
        id,
        profileId,
        unread: 0,
        createdAt: new Date().toISOString(),
        messages: [],
      }
      setConversations((current) => [conversation, ...current])
      return { ok: true, id, existing: false }
    },
    [canMessage, conversations, setConversations],
  )

  const sendMessage = useCallback(
    (conversationId, rawText) => {
      const text = rawText.trim()
      if (!text) return false
      const conversation = conversations.find((item) => item.id === conversationId)
      if (!conversation) return false

      const message = {
        id: createId('msg'),
        sender: 'me',
        text,
        at: new Date().toISOString(),
      }
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId
            ? { ...item, messages: [...item.messages, message], unread: 0 }
            : item,
        ),
      )

      setTypingIds((current) => (current.includes(conversationId) ? current : [...current, conversationId]))

      const delay = 1500 + Math.round(Math.random() * 1400)
      const timer = setTimeout(() => {
        const replyText = demoReplies[Math.floor(Math.random() * demoReplies.length)]
        const reply = {
          id: createId('msg'),
          sender: 'them',
          text: replyText,
          at: new Date().toISOString(),
        }
        setTypingIds((current) => current.filter((id) => id !== conversationId))
        setConversations((current) =>
          current.map((item) => {
            if (item.id !== conversationId) return item
            const isActive = activeRef.current === conversationId
            return {
              ...item,
              messages: [...item.messages, reply],
              unread: isActive ? 0 : (item.unread || 0) + 1,
            }
          }),
        )
        if (activeRef.current !== conversationId) {
          const profile = getProfileById(conversation.profileId)
          notifyRef.current({
            type: 'message',
            title: `New message from ${profile?.firstName || 'your connection'}`,
            body: replyText,
            to: `/messages?c=${conversationId}`,
            profileId: conversation.profileId,
          })
        }
      }, delay)
      timers.current.push(timer)
      return true
    },
    [conversations, setConversations],
  )

  const clearConversation = useCallback(
    (conversationId) => {
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId ? { ...item, messages: [], unread: 0 } : item,
        ),
      )
    },
    [setConversations],
  )

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aDate = new Date(lastMessage(a)?.at || a.createdAt || 0).getTime()
      const bDate = new Date(lastMessage(b)?.at || b.createdAt || 0).getTime()
      return bDate - aDate
    })
  }, [conversations])

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, conversation) => sum + (conversation.unread || 0), 0),
    [conversations],
  )

  const isTyping = useCallback((id) => typingIds.includes(id), [typingIds])

  const value = useMemo(
    () => ({
      conversations,
      sortedConversations,
      unreadTotal,
      activeConversationId,
      typingIds,
      getConversation,
      getConversationByProfile,
      hasExistingConversation,
      canMessage,
      ensureConversation,
      sendMessage,
      markRead,
      setActiveConversation,
      clearConversation,
      isTyping,
    }),
    [
      conversations,
      sortedConversations,
      unreadTotal,
      activeConversationId,
      typingIds,
      getConversation,
      getConversationByProfile,
      hasExistingConversation,
      canMessage,
      ensureConversation,
      sendMessage,
      markRead,
      setActiveConversation,
      clearConversation,
      isTyping,
    ],
  )

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>
}

export function useMessaging() {
  const context = useContext(MessagingContext)
  if (!context) throw new Error('useMessaging must be used inside MessagingProvider')
  return context
}
