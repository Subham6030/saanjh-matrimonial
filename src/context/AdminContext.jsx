import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { adminSeed } from '../data/dashboard'
import { profiles } from '../data/profiles'
import { createId } from '../utils/ids'

const AdminContext = createContext(null)

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function AdminProvider({ children }) {
  const [state, setState] = useLocalStorage('saanjh.admin.state', () => clone(adminSeed))

  const recordActivity = useCallback(
    ({ type, text, detail }) => {
      setState((current) => ({
        ...current,
        recentActivity: [
          {
            id: createId('activity'),
            type,
            text,
            detail,
            at: new Date().toISOString(),
          },
          ...(current.recentActivity || []),
        ].slice(0, 20),
      }))
    },
    [setState],
  )

  const updateProfileOverride = useCallback(
    (profileId, patch) => {
      setState((current) => ({
        ...current,
        profileOverrides: {
          ...current.profileOverrides,
          [profileId]: { ...(current.profileOverrides?.[profileId] || {}), ...patch },
        },
      }))
    },
    [setState],
  )

  const verifyProfile = useCallback(
    (profileId, verified = true) => {
      updateProfileOverride(profileId, {
        verified,
        reviewStatus: verified ? 'approved' : 'pending',
      })
      recordActivity({
        type: 'profile',
        text: verified ? 'Profile verification updated' : 'Verification removed',
        detail: `Demo profile ${profileId}`,
      })
    },
    [recordActivity, updateProfileOverride],
  )

  const setProfileStatus = useCallback(
    (profileId, status) => {
      updateProfileOverride(profileId, { status })
      recordActivity({
        type: 'profile',
        text: status === 'suspended' ? 'Demo account suspended' : 'Demo account restored',
        detail: `Demo profile ${profileId}`,
      })
    },
    [recordActivity, updateProfileOverride],
  )

  const addReport = useCallback(
    ({ profileId, reason, details, reporterName }) => {
      const report = {
        id: createId('report'),
        profileId,
        reporterName: reporterName || 'Sample member',
        reason,
        details,
        createdAt: new Date().toISOString(),
        status: 'pending',
        note: '',
      }
      setState((current) => ({
        ...current,
        reports: [report, ...(current.reports || [])],
      }))
      recordActivity({
        type: 'report',
        text: 'New profile report submitted',
        detail: reason,
      })
      return report
    },
    [recordActivity, setState],
  )

  const updateReport = useCallback(
    (reportId, patch) => {
      setState((current) => ({
        ...current,
        reports: (current.reports || []).map((report) =>
          report.id === reportId ? { ...report, ...patch, updatedAt: new Date().toISOString() } : report,
        ),
      }))
    },
    [setState],
  )

  const updateSubscription = useCallback(
    (subscriptionId, patch) => {
      setState((current) => ({
        ...current,
        subscriptions: (current.subscriptions || []).map((subscription) =>
          subscription.id === subscriptionId ? { ...subscription, ...patch } : subscription,
        ),
      }))
    },
    [setState],
  )

  const saveSettings = useCallback(
    (nextSettings) => {
      setState((current) => ({ ...current, settings: clone(nextSettings) }))
      recordActivity({
        type: 'profile',
        text: 'Admin settings updated',
        detail: 'Demo platform configuration saved',
      })
    },
    [recordActivity, setState],
  )

  const resetAdminData = useCallback(() => {
    setState(clone(adminSeed))
  }, [setState])

  const adminProfiles = useMemo(() => {
    return profiles.map((profile) => {
      const override = state.profileOverrides?.[profile.id] || {}
      return {
        ...profile,
        ...override,
        status: override.status || 'active',
        verified: override.verified ?? profile.verified,
        reviewStatus: override.reviewStatus || 'approved',
      }
    })
  }, [state.profileOverrides])

  const getAdminProfile = useCallback(
    (profileId) => adminProfiles.find((profile) => profile.id === profileId) || null,
    [adminProfiles],
  )

  const pendingReports = useMemo(
    () => (state.reports || []).filter((report) => report.status === 'pending').length,
    [state.reports],
  )

  const value = useMemo(
    () => ({
      state,
      settings: state.settings,
      reports: state.reports || [],
      subscriptions: state.subscriptions || [],
      adminProfiles,
      pendingReports,
      recentActivity: state.recentActivity || [],
      updateProfileOverride,
      verifyProfile,
      setProfileStatus,
      addReport,
      updateReport,
      updateSubscription,
      saveSettings,
      resetAdminData,
      getAdminProfile,
      recordActivity,
    }),
    [
      state,
      adminProfiles,
      pendingReports,
      updateProfileOverride,
      verifyProfile,
      setProfileStatus,
      addReport,
      updateReport,
      updateSubscription,
      saveSettings,
      resetAdminData,
      getAdminProfile,
      recordActivity,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdmin must be used inside AdminProvider')
  return context
}
