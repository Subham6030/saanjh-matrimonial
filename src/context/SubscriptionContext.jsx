import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'
import { useNotifications } from './NotificationContext'
import { getPlan } from '../data/plans'
import { addMonths } from '../utils/format'

const SubscriptionContext = createContext(null)

function initialSubscription(user) {
  if (user?.id === 'demo-member') {
    return {
      planId: 'plus',
      interval: 'monthly',
      status: 'active',
      startedAt: '2026-10-18T10:00:00+05:30',
      renewsAt: '2026-11-18T10:00:00+05:30',
      paymentStatus: 'paid',
    }
  }
  return {
    planId: 'free',
    interval: 'monthly',
    status: 'active',
    startedAt: new Date().toISOString(),
    renewsAt: null,
    paymentStatus: 'not-applicable',
  }
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const owner = user?.id || 'guest'
  const initial = useCallback(() => initialSubscription(user), [user])
  const [subscription, setSubscription] = useLocalStorage(
    `saanjh.subscription.${owner}`,
    initial,
  )

  const activatePlan = useCallback(
    (planId, interval = 'monthly') => {
      const plan = getPlan(planId)
      const startedAt = new Date().toISOString()
      const next = {
        planId,
        interval,
        status: 'active',
        startedAt,
        renewsAt: planId === 'free' ? null : addMonths(interval === 'yearly' ? 12 : 1),
        paymentStatus: planId === 'free' ? 'not-applicable' : 'paid',
      }
      setSubscription(next)
      addNotification({
        type: 'subscription',
        title: `${plan.name} membership is active`,
        body: `Your ${plan.name.toLowerCase()} plan is now active in this simulated environment. No payment was processed.`,
        to: '/settings',
      })
      return next
    },
    [addNotification, setSubscription],
  )

  const cancelSubscription = useCallback(() => {
    setSubscription((current) => ({
      ...current,
      status: 'cancelled',
      renewsAt: current.renewsAt,
      paymentStatus: current.paymentStatus,
    }))
    addNotification({
      type: 'subscription',
      title: 'Membership cancelled',
      body: 'Your demo membership has been marked as cancelled. You can reactivate any plan at any time.',
      to: '/plans',
    })
  }, [addNotification, setSubscription])

  const plan = useMemo(() => getPlan(subscription.planId), [subscription.planId])
  const isPremium = subscription.planId === 'premium' && subscription.status === 'active'
  const isActive = subscription.status === 'active'

  const value = useMemo(
    () => ({
      subscription,
      plan,
      isPremium,
      isActive,
      activatePlan,
      cancelSubscription,
    }),
    [subscription, plan, isPremium, isActive, activatePlan, cancelSubscription],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return context
}
