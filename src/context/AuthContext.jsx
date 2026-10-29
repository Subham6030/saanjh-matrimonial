import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEMO_ACCOUNTS } from '../utils/demo'
import { hashString } from '../utils/ids'
import { EMAIL_PATTERN } from '../utils/validation'

const AuthContext = createContext(null)
const AUTH_KEY = 'saanjh.auth.user'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function titleCase(value = '') {
  return value
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim()
}

function demoUser(role) {
  const account = DEMO_ACCOUNTS[role]
  return {
    id: role === 'admin' ? 'admin-demo' : 'demo-member',
    name: account.name,
    email: account.email,
    role,
    joinedAt: '2026-07-12T10:00:00+05:30',
    demo: true,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(AUTH_KEY, null)

  const login = useCallback(
    async ({ email, password, role }) => {
      await wait(550)
      if (role) {
        const nextUser = demoUser(role)
        setUser(nextUser)
        return nextUser
      }

      const normalizedEmail = (email || '').trim().toLowerCase()
      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        throw new Error('Enter a valid email address.')
      }
      if (!password || password.length < 6) {
        throw new Error('Enter a password with at least 6 characters.')
      }
      if (normalizedEmail === DEMO_ACCOUNTS.admin.email) {
        const nextUser = demoUser('admin')
        setUser(nextUser)
        return nextUser
      }
      if (normalizedEmail === DEMO_ACCOUNTS.member.email) {
        const nextUser = demoUser('member')
        setUser(nextUser)
        return nextUser
      }

      const localPart = normalizedEmail.split('@')[0]
      const nextUser = {
        id: `u-${hashString(normalizedEmail)}`,
        name: titleCase(localPart) || 'Guest Member',
        email: normalizedEmail,
        role: 'member',
        joinedAt: new Date().toISOString(),
        demo: false,
      }
      setUser(nextUser)
      return nextUser
    },
    [setUser],
  )

  const loginAsDemo = useCallback((role = 'member') => login({ role }), [login])

  const register = useCallback(
    async (payload) => {
      await wait(700)
      const normalizedEmail = payload.email.trim().toLowerCase()
      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        throw new Error('Enter a valid email address.')
      }
      const nextUser = {
        id: `u-${hashString(normalizedEmail)}-${Date.now().toString(36)}`,
        name: payload.fullName.trim(),
        email: normalizedEmail,
        phone: payload.phone?.trim() || '',
        gender: payload.gender,
        dob: payload.dob,
        profileFor: payload.profileFor,
        role: 'member',
        joinedAt: new Date().toISOString(),
        demo: false,
      }
      setUser(nextUser)
      return nextUser
    },
    [setUser],
  )

  const updateUser = useCallback(
    (patch) => {
      setUser((current) => (current ? { ...current, ...patch } : current))
    },
    [setUser],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      loginAsDemo,
      register,
      updateUser,
      logout,
    }),
    [user, login, loginAsDemo, register, updateUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
