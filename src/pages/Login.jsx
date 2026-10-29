import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { DEMO_ACCOUNTS } from '../utils/demo'
import { validateEmail } from '../utils/validation'
import { Alert } from '../components/common/ui'
import Button from '../components/common/Button'
import { PasswordField, TextField } from '../components/forms/FormControls'

export default function Login() {
  usePageMeta('Sign in', 'Sign in to the Saanjh matrimonial front-end demo with a simulated member or admin session.')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState('')
  const [serverError, setServerError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setServerError('')
  }

  function validate() {
    const next = {}
    const emailError = validateEmail(form.email)
    if (emailError) next.email = emailError
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const user = await login({ email: form.email, password: form.password })
      toast.success(`Signed in as ${user.name}. This is a simulated session.`, {
        title: 'Welcome back',
      })
      const destination = user.role === 'admin' ? from || '/admin' : from || '/dashboard'
      navigate(destination, { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo(role) {
    setDemoLoading(role)
    setServerError('')
    try {
      const user = await login({ role })
      toast.success(
        `Signed in as ${user.name}. Demo authentication is simulated and no password was checked.`,
        { title: role === 'admin' ? 'Demo admin session' : 'Demo member session' },
      )
      navigate(role === 'admin' ? '/admin' : from || '/dashboard', { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to start the demo session.')
    } finally {
      setDemoLoading('')
    }
  }

  function fillDemo() {
    setForm({ email: DEMO_ACCOUNTS.member.email, password: DEMO_ACCOUNTS.member.passwordHint })
    setErrors({})
  }

  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h1 className="display-page mt-2">Sign in to Saanjh</h1>
      <p className="mt-3 text-sm leading-7 text-ink-secondary">
        Continue exploring the demo experience. Sign-in is simulated — no credentials are checked
        against a real account or stored.
      </p>

      <div className="mt-6 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-xs leading-6 text-ink-secondary">
        <p className="flex items-center gap-1.5 font-semibold text-warning">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Demo authentication
        </p>
        <p className="mt-1">
          Any valid-looking email and a 6+ character password will work. Passwords are never saved.
        </p>
      </div>

      {serverError && (
        <Alert variant="error" className="mt-4">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <TextField
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <PasswordField
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          error={errors.password}
          type={showPassword ? 'text' : 'password'}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((value) => !value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={fillDemo}
            className="font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            Use demo credentials
          </button>
          <span className="text-ink-muted">
            {DEMO_ACCOUNTS.member.email} · {DEMO_ACCOUNTS.member.passwordHint}
          </span>
        </div>

        <Button type="submit" fullWidth loading={loading} loadingText="Signing in…" size="lg">
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          or explore instantly
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleDemo('member')}
          loading={demoLoading === 'member'}
          loadingText="Opening…"
          leftIcon={<Sparkles className="h-4 w-4" />}
        >
          Demo member
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleDemo('admin')}
          loading={demoLoading === 'admin'}
          loadingText="Opening…"
          leftIcon={<ShieldCheck className="h-4 w-4" />}
        >
          Demo admin
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        New to Saanjh?{' '}
        <Link to="/register" className="font-semibold text-brand hover:text-brand-hover">
          Create a sample profile <ArrowRight className="inline h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </p>
    </div>
  )
}
