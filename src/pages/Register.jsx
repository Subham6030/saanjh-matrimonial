import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { profileForOptions, genders } from '../data/options'
import { calculateAge } from '../utils/format'
import {
  passwordStrength,
  validateDob,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../utils/validation'
import Button from '../components/common/Button'
import { Alert } from '../components/common/ui'
import {
  Checkbox,
  PasswordField,
  SelectField,
  TextField,
} from '../components/forms/FormControls'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  dob: '',
  gender: '',
  profileFor: 'Self',
  terms: false,
}

export default function Register() {
  usePageMeta('Create an account', 'Join the Saanjh matrimonial demo with a simulated profile. No password or sensitive credentials are stored.')
  const { register } = useAuth()
  const { settings } = useAdmin()
  const toast = useToast()
  const navigate = useNavigate()
  const minAge = settings?.registration?.minAge ?? 18

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const age = useMemo(() => calculateAge(form.dob), [form.dob])
  const strength = useMemo(() => passwordStrength(form.password), [form.password])
  const maxDate = new Date().toISOString().slice(0, 10)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setServerError('')
  }

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Your full name is required.'
    else if (form.fullName.trim().length < 2) next.fullName = 'Enter at least 2 characters.'

    const emailError = validateEmail(form.email)
    if (emailError) next.email = emailError
    const phoneError = validatePhone(form.phone)
    if (phoneError) next.phone = phoneError
    const passwordError = validatePassword(form.password)
    if (passwordError) next.password = passwordError
    else if (strength.score < 2) next.password = 'Choose a slightly stronger password.'

    const dobError = validateDob(form.dob, minAge)
    if (dobError) next.dob = dobError
    if (!form.gender) next.gender = 'Please choose a gender for matching preferences.'
    if (!form.profileFor) next.profileFor = 'Select who this profile is for.'
    if (!form.terms) next.terms = 'Please accept the demo terms and privacy policy.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      await register(form)
      toast.success('Your demo account is ready. A few more details will make your profile shine.', {
        title: 'Account created',
      })
      navigate('/create-profile', { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to create the demo account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="eyebrow">Join the demo</p>
      <h1 className="display-page mt-2">Create your profile</h1>
      <p className="mt-3 text-sm leading-7 text-ink-secondary">
        A few basics first. You can add the rest of your story in the guided profile builder. No
        password or sensitive data is stored in this front-end demo.
      </p>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-ink-muted">
        <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
        Demo registration · simulated session · you must be {minAge}+
      </div>

      {serverError && (
        <Alert variant="error" className="mt-4">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <TextField
          label="Full name"
          value={form.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          error={errors.fullName}
          autoComplete="name"
          placeholder="e.g. Ananya Iyer"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
          <TextField
            label="Phone number"
            type="tel"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            error={errors.phone}
            autoComplete="tel"
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <TextField
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={(event) => update('dob', event.target.value)}
              error={errors.dob}
              max={maxDate}
              required
            />
            {age !== null && (
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-ink-muted">Calculated age</span>
                <span className={age >= minAge ? 'font-semibold text-success' : 'font-semibold text-error'}>
                  {age} years
                </span>
              </div>
            )}
          </div>
          <SelectField
            label="Gender"
            value={form.gender}
            onChange={(event) => update('gender', event.target.value)}
            error={errors.gender}
            placeholder="Select gender"
            required
          >
            {genders.map((gender) => (
              <option key={gender.value} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </SelectField>
        </div>

        <SelectField
          label="Profile created for"
          value={form.profileFor}
          onChange={(event) => update('profileFor', event.target.value)}
          error={errors.profileFor}
          required
        >
          {profileForOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <PasswordField
          label="Password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          error={errors.password}
          type={showPassword ? 'text' : 'password'}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((value) => !value)}
          showStrength
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use a mix of letters, numbers and symbols. This password is never stored."
          required
        />
        <div>
          <Checkbox
            label="I accept the demo terms and privacy policy."
            checked={form.terms}
            onChange={(event) => update('terms', event.target.checked)}
            error={errors.terms}
          />
          <p className="mt-1.5 pl-[30px] text-[11px] leading-5 text-ink-muted">
            Read the{' '}
            <Link to="/terms" className="font-semibold text-brand hover:text-brand-hover">
              terms of use
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-semibold text-brand hover:text-brand-hover">
              privacy policy
            </Link>
            . This is a simulated service and no real account is created.
          </p>
        </div>

        <Button type="submit" fullWidth loading={loading} loadingText="Creating demo account…" size="lg">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-secondary">
        Already exploring?{' '}
        <Link to="/login" className="font-semibold text-brand hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
