import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Save, Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn'
import { calculateAge } from '../../utils/format'
import { validateDob } from '../../utils/validation'
import { useAdmin } from '../../context/AdminContext'
import { useNotifications } from '../../context/NotificationContext'
import { useProfile } from '../../context/ProfileContext'
import { useToast } from '../../context/ToastContext'
import Button from '../common/Button'
import { ProgressBar } from '../common/ui'
import { WIZARD_STEPS, WizardStep } from './WizardSteps'

function buildInitial(profile) {
  return {
    ...profile,
    family: {
      type: '',
      values: '',
      location: '',
      about: '',
      ...(profile?.family || {}),
    },
    photos: profile?.photos || [],
    privacy: {
      showIncome: true,
      showFamily: true,
      showLifestyle: true,
      showPreferences: true,
      ...(profile?.privacy || {}),
    },
  }
}

function buildPayload(form) {
  const name = [form.firstName, form.lastName].filter(Boolean).join(' ').trim()
  return {
    ...form,
    displayName: name,
    age: calculateAge(form.dob),
    primaryPhoto: form.photos?.[0] || '',
    family: { ...form.family },
  }
}

export default function ProfileWizard({ mode = 'create' }) {
  const { profile, updateProfile } = useProfile()
  const { addNotification } = useNotifications()
  const { settings } = useAdmin()
  const toast = useToast()
  const navigate = useNavigate()
  const minAge = settings?.registration?.minAge ?? 18

  const [form, setForm] = useState(() => buildInitial(profile))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [draftSaving, setDraftSaving] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function updateFamily(field, value) {
    setForm((current) => ({
      ...current,
      family: { ...current.family, [field]: value },
    }))
    setErrors((current) => ({ ...current, [`family.${field}`]: '' }))
  }

  function validateStep(index, data = form) {
    const next = {}
    if (index === 0) {
      if (!data.firstName?.trim()) next.firstName = 'First name is required.'
      const dobError = validateDob(data.dob, minAge)
      if (dobError) next.dob = dobError
      if (!data.gender) next.gender = 'Please select a gender.'
      if (!data.maritalStatus) next.maritalStatus = 'Please select your marital status.'
      if (!data.managedBy) next.managedBy = 'Please select who manages this profile.'
      if (!data.headline?.trim()) next.headline = 'A profile headline is required.'
      else if (data.headline.trim().length < 10)
        next.headline = 'Use at least 10 characters for a more meaningful headline.'
    }
    if (index === 1) {
      if (!data.education) next.education = 'Please select your highest education.'
      if (!data.profession?.trim()) next.profession = 'Profession is required.'
    }
    if (index === 2) {
      if (!data.heightCm) next.heightCm = 'Please select your height.'
      if (!data.languages?.length) next.languages = 'Choose at least one language.'
      if (!data.interests || data.interests.length < 2)
        next.interests = 'Choose at least two interests.'
      if (!data.bio?.trim()) next.bio = 'Your story is required.'
      else if (data.bio.trim().length < 40)
        next.bio = 'Write at least 40 characters so matches can get to know you.'
    }
    if (index === 4) {
      if (!data.country) next.country = 'Please select a country.'
      if (!data.state?.trim()) next.state = 'State or region is required.'
      if (!data.city?.trim()) next.city = 'City is required.'
      if (!data.religion) next.religion = 'Please select a religion.'
    }
    return next
  }

  function persistDraft(data = form) {
    updateProfile(buildPayload(data))
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function focusFirstError() {
    window.setTimeout(() => {
      const target = document.querySelector('[aria-invalid="true"]')
      target?.focus()
    }, 80)
  }

  function goNext() {
    const stepErrors = validateStep(step)
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors)
      toast.error('A few details need your attention before moving on.')
      focusFirstError()
      return
    }
    setErrors({})
    persistDraft()
    setStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1))
    scrollTop()
  }

  function goBack() {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
    scrollTop()
  }

  function handleSaveDraft() {
    setDraftSaving(true)
    window.setTimeout(() => {
      persistDraft()
      setDraftSaving(false)
      toast.success('Draft saved in this browser. You can continue later.', { title: 'Draft saved' })
    }, 300)
  }

  function findFirstErrorStep() {
    for (let index = 0; index <= 4; index += 1) {
      if (Object.keys(validateStep(index, form)).length > 0) return index
    }
    return null
  }

  function handlePublish() {
    const allErrors = {}
    for (let index = 0; index <= 4; index += 1) {
      Object.assign(allErrors, validateStep(index, form))
    }

    if (Object.keys(allErrors).length) {
      setErrors(allErrors)
      const firstStep = findFirstErrorStep()
      if (firstStep !== null) setStep(firstStep)
      toast.error('Please complete the highlighted details before publishing.')
      focusFirstError()
      return
    }

    setSaving(true)
    window.setTimeout(() => {
      updateProfile(buildPayload(form))
      addNotification({
        type: 'profile',
        title: mode === 'edit' ? 'Profile updated' : 'Your profile is live',
        body:
          mode === 'edit'
            ? 'Your latest profile changes have been saved in this demo.'
            : 'Your sample profile has been published. Explore matches whenever you are ready.',
        to: mode === 'edit' ? '/profile' : '/matches',
      })
      setSaving(false)
      toast.success(
        mode === 'edit'
          ? 'Your profile changes are saved.'
          : 'Your profile is live. Here are some matches we think you should meet.',
        { title: mode === 'edit' ? 'Changes saved' : 'Profile published' },
      )
      navigate(mode === 'edit' ? '/dashboard' : '/matches')
    }, 600)
  }

  const progress = Math.round(((step + 1) / WIZARD_STEPS.length) * 100)
  const current = WIZARD_STEPS[step]

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Profile builder</p>
          <h1 className="display-page mt-2">
            {mode === 'edit' ? 'Edit your profile' : 'Create your profile'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">
            {mode === 'edit'
              ? 'Keep your story current. Changes are stored in this browser for the demo.'
              : 'Seven short steps to a profile that feels like you. Your progress is saved in this browser as you go.'}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleSaveDraft}
          loading={draftSaving}
          loadingText="Saving…"
          leftIcon={<Save className="h-3.5 w-3.5" />}
        >
          Save draft
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-ink-secondary">
            Step {step + 1} of {WIZARD_STEPS.length}: <span className="text-brand">{current.label}</span>
          </p>
          <p className="text-ink-muted">{progress}% complete</p>
        </div>
        <ProgressBar value={progress} className="mt-2" size="sm" label="Profile completion" />
      </div>

      <ol className="mt-5 hidden items-center gap-1 md:flex" aria-label="Profile builder steps">
        {WIZARD_STEPS.map((item, index) => {
          const Icon = item.icon
          const done = index < step
          const active = index === step
          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors',
                  active && 'border-brand bg-brand text-white',
                  done && 'border-success/30 bg-success/10 text-success',
                  !active && !done && 'border-line bg-bg-card text-ink-muted',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
              <span
                className={cn(
                  'hidden truncate text-[11px] font-semibold lg:block',
                  active ? 'text-ink-primary' : 'text-ink-muted',
                )}
              >
                {item.label}
              </span>
              {index < WIZARD_STEPS.length - 1 && <span className="hidden h-px flex-1 bg-line lg:block" />}
            </li>
          )
        })}
      </ol>

      <div className="mt-6">
        <WizardStep
          step={step}
          form={form}
          update={update}
          updateFamily={updateFamily}
          errors={errors}
          onEdit={(target) => {
            setStep(target)
            scrollTop()
          }}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 rounded-2xl border border-line bg-bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 0 || saving}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <span className="hidden text-xs text-ink-muted sm:inline">
            {step === WIZARD_STEPS.length - 1 ? 'Ready when you are.' : 'Drafts save as you continue.'}
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {step < WIZARD_STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              loading={saving}
              loadingText={mode === 'edit' ? 'Saving changes…' : 'Publishing…'}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              {mode === 'edit' ? 'Save changes' : 'Publish profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
