import { useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { usePageMeta } from '../../hooks/usePageMeta'
import Logo from '../common/Logo'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'

export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }
  return <Outlet />
}

export function AdminGate() {
  const { isAdmin, loginAsDemo, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  usePageMeta('Admin access', 'Simulated admin access for the Saanjh demo.')

  if (isAdmin) return <Outlet />

  async function enterAdmin() {
    setLoading(true)
    try {
      await loginAsDemo('admin')
      toast.success('Entered the demo admin console. Access is simulated.', {
        title: 'Demo admin session',
      })
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary bg-hero-wash">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="card-surface w-full max-w-lg p-6 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="display-page mt-5">Admin preview</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-secondary">
            {user
              ? 'You are signed in as a member. The admin console uses a seeded demo admin session so you can explore moderation and platform settings.'
              : 'The admin console is protected by a simulated role check. Continue with the seeded demo admin account to explore it.'}
          </p>

          <div className="mt-6 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-left text-xs leading-6 text-ink-secondary">
            <p className="flex items-center gap-1.5 font-semibold text-warning">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Access is simulated
            </p>
            <p className="mt-1">
              Frontend role checks do not provide secure authorisation. A production admin panel
              requires server-side authentication, permissions and audit logging.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={enterAdmin} loading={loading} leftIcon={<Sparkles className="h-4 w-4" />}>
              Continue with demo admin
            </Button>
            <Button to="/" variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to the public site
            </Button>
          </div>
          <p className="mt-4 text-[11px] text-ink-muted">
            Sample admin email: admin@saanjh.example · password hint: admin1234
          </p>
        </div>
      </main>
    </div>
  )
}
