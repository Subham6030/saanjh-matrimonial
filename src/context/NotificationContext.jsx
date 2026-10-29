import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { seedNotifications } from '../data/notifications'
import { createId } from '../utils/ids'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const owner = user?.id || 'guest'
  const initial = useCallback(
    () => (user ? seedNotifications.map((item) => ({ ...item })) : []),
    [user],
  )
  const [notifications, setNotifications] = useLocalStorage(
    `saanjh.notifications.${owner}`,
    initial,
  )

  const addNotification = useCallback(
    ({ type = 'announcement', title, body, to = '/notifications', profileId = null }) => {
      setNotifications((current) => [
        {
          id: createId('note'),
          type,
          title,
          body,
          to,
          profileId,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ])
    },
    [setNotifications],
  )

  const markRead = useCallback(
    (id) => {
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, read: true } : item)),
      )
    },
    [setNotifications],
  )

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }, [setNotifications])

  const removeNotification = useCallback(
    (id) => {
      setNotifications((current) => current.filter((item) => item.id !== id))
    },
    [setNotifications],
  )

  const clearAll = useCallback(() => setNotifications([]), [setNotifications])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  )

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      removeNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      removeNotification,
      clearAll,
    ],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider')
  return context
}
