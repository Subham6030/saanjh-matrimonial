import { useEffect, useState } from 'react'
import {
  Megaphone,
  RotateCcw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { EMAIL_PATTERN } from '../utils/validation'
import { formatCurrency } from '../utils/format'
import { resetDemoData } from '../utils/demo'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import { ConfirmDialog } from '../components/common/Modal'
import { Alert, Badge, PageHeader } from '../components/common/ui'
import {
  FormSection,
  SelectField,
  TextField,
  Toggle,
} from '../components/forms/FormControls'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export default function AdminSettings() {
  usePageMeta('Admin settings', 'Configure the simulated Saanjh demo platform, matching rules and plan pricing.')
  const { settings, saveSettings, resetAdminData } = useAdmin()
  const toast = useToast()

  const [form, setForm] = useState(() => clone(settings))
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState('')

  useEffect(() => {
    setForm(clone(settings))
  }, [settings])

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  function updateNested(group, key, value) {
    setForm((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }))
    setErrors((current) => ({ ...current, [`${group}.${key}`]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.brandName.trim()) next.brandName = 'A brand name is required.'
    if (!form.tagline.trim()) next.tagline = 'A tagline is required.'
    if (!EMAIL_PATTERN.test(form.supportEmail.trim())) next.supportEmail = 'Enter a valid support email.'

    const minScore = Number(form.matching.minScore)
    if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100)
      next['matching.minScore'] = 'Use a score between 0 and 100.'
    const suggestions = Number(form.matching.maxSuggestions)
    if (!Number.isFinite(suggestions) || suggestions < 1 || suggestions > 100)
      next['matching.maxSuggestions'] = 'Use between 1 and 100 suggestions.'

    const minAge = Number(form.registration.minAge)
    if (!Number.isFinite(minAge) || minAge < 18 || minAge > 80)
      next['registration.minAge'] = 'Minimum age must be between 18 and 80.'

    Object.entries(form.planPrices).forEach(([key, value]) => {
      const amount = Number(value)
      if (!Number.isFinite(amount) || amount < 0) next[`price.${key}`] = 'Enter a valid amount.'
    })

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave() {
    if (!validate()) {
      toast.error('Please fix the highlighted settings before saving.', { title: 'Check the form' })
      return
    }
    saveSettings({
      ...form,
      brandName: form.brandName.trim(),
      tagline: form.tagline.trim(),
      supportEmail: form.supportEmail.trim(),
    })
    toast.success('Demo platform settings were saved in this browser.')
  }

  function handleDiscard() {
    setForm(clone(settings))
    setErrors({})
    toast.info('Unsaved changes were discarded.')
  }

  function handleReset() {
    if (confirm === 'admin') {
      resetAdminData()
      toast.success('Admin configuration, reports and subscription overrides were reset.')
    } else if (confirm === 'all') {
      resetDemoData()
      return
    }
    setConfirm('')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin settings"
        title="Platform configuration"
        description="Adjust the simulated brand, matching rules, registration rules and sample pricing. Changes stay in this browser."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button size="sm" onClick={handleSave} leftIcon={<Save className="h-3.5 w-3.5" />}>
              Save settings
            </Button>
          </>
        }
      />

      <Alert variant="warning" title="Illustrative configuration">
        These settings demonstrate an admin experience. They are not connected to a backend and do
        not automatically modify member plans, route access or real platform behaviour.
      </Alert>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <FormSection
            title="Brand & support"
            description="The name and contact details shown in the demo experience."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Brand name"
                value={form.brandName}
                onChange={(event) => update('brandName', event.target.value)}
                error={errors.brandName}
              />
              <TextField
                label="Support email"
                type="email"
                value={form.supportEmail}
                onChange={(event) => update('supportEmail', event.target.value)}
                error={errors.supportEmail}
              />
              <TextField
                label="Tagline"
                value={form.tagline}
                onChange={(event) => update('tagline', event.target.value)}
                error={errors.tagline}
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

          <FormSection
            title="Site announcement"
            description="Control the simulated announcement strip on public pages."
          >
            <div className="divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="Show announcement"
                description="Display the sample notice above the public site navigation."
                checked={form.announcementEnabled}
                onChange={(value) => update('announcementEnabled', value)}
              />
              <div className="pt-3.5">
                <SelectField
                  label="Default profile visibility"
                  value={form.defaultVisibility}
                  onChange={(event) => update('defaultVisibility', event.target.value)}
                  hint="Illustrative default for new member profiles in this demo."
                  className="sm:max-w-xs"
                >
                  <option value="members">Signed-in members only</option>
                  <option value="public">Anyone browsing</option>
                  <option value="connections">Accepted connections only</option>
                </SelectField>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Matching rules"
            description="Illustrative defaults for compatibility-led recommendations."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Minimum compatibility score"
                type="number"
                min="0"
                max="100"
                value={form.matching.minScore}
                onChange={(event) => updateNested('matching', 'minScore', event.target.value)}
                error={errors['matching.minScore']}
                hint="A percentage from 0 to 100."
              />
              <TextField
                label="Maximum suggestions"
                type="number"
                min="1"
                max="100"
                value={form.matching.maxSuggestions}
                onChange={(event) => updateNested('matching', 'maxSuggestions', event.target.value)}
                error={errors['matching.maxSuggestions']}
                hint="How many profiles a result page may show."
              />
            </div>
            <div className="mt-4 divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="Strict age matching by default"
                description="Use age as a must-match filter for new preferences."
                checked={form.matching.strictAge}
                onChange={(value) => updateNested('matching', 'strictAge', value)}
              />
              <Toggle
                className="py-3.5 last:pb-0"
                label="Show score explanations"
                description="Let members see the compatibility signal breakdown."
                checked={form.matching.showScoreExplanation}
                onChange={(value) => updateNested('matching', 'showScoreExplanation', value)}
              />
            </div>
          </FormSection>

          <FormSection
            title="Registration"
            description="Demo defaults for creating a new sample profile."
          >
            <TextField
              label="Minimum age"
              type="number"
              min="18"
              max="80"
              value={form.registration.minAge}
              onChange={(event) => updateNested('registration', 'minAge', event.target.value)}
              error={errors['registration.minAge']}
              hint="Members must be at least this age to register."
              className="sm:max-w-xs"
            />
            <div className="mt-4 divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="Require profile review"
                description="Place newly created demo profiles into the review queue."
                checked={form.registration.requireProfileReview}
                onChange={(value) => updateNested('registration', 'requireProfileReview', value)}
              />
              <Toggle
                className="py-3.5 last:pb-0"
                label="Allow guardian-managed profiles"
                description="Let a parent, sibling or guardian create a profile."
                checked={form.registration.allowGuardian}
                onChange={(value) => updateNested('registration', 'allowGuardian', value)}
              />
            </div>
          </FormSection>

          <FormSection
            title="Plan pricing"
            description="Sample prices shown in the admin data. Public plan cards use their own demo values."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: 'plusMonthly', label: 'Plus · monthly' },
                { key: 'plusYearly', label: 'Plus · yearly' },
                { key: 'premiumMonthly', label: 'Premium · monthly' },
                { key: 'premiumYearly', label: 'Premium · yearly' },
              ].map((item) => (
                <TextField
                  key={item.key}
                  label={item.label}
                  type="number"
                  min="0"
                  step="1"
                  value={form.planPrices[item.key]}
                  onChange={(event) => updateNested('planPrices', item.key, event.target.value)}
                  error={errors[`price.${item.key}`]}
                  hint={`Preview: ${formatCurrency(Number(form.planPrices[item.key]) || 0)}`}
                />
              ))}
            </div>
          </FormSection>

          <FormSection
            title="Danger zone"
            description="Reset local demo data. These actions cannot be undone."
          >
            <div className="space-y-3">
              <div className="flex flex-col gap-3 rounded-xl border border-warning/25 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-primary">Reset admin configuration</p>
                  <p className="mt-0.5 text-xs leading-5 text-ink-muted">
                    Restore seeded reports, subscription statuses and platform settings.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirm('admin')}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                >
                  Reset admin data
                </Button>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-error/25 bg-error/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-primary">Reset the entire demo</p>
                  <p className="mt-0.5 text-xs leading-5 text-ink-muted">
                    Clear all Saanjh local data, including member profiles and sessions, then reload.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirm('all')}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                >
                  Reset everything
                </Button>
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard changes
            </Button>
            <Button size="sm" onClick={handleSave} leftIcon={<Save className="h-3.5 w-3.5" />}>
              Save settings
            </Button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="card-surface overflow-hidden">
            <div className="bg-gradient-to-br from-brand/15 via-bg-card to-brand-accent/10 p-5">
              <Badge tone="warning" size="sm">Announcement preview</Badge>
              <p className="mt-3 flex items-center gap-2 font-display text-2xl text-ink-primary">
                <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
                {form.brandName || 'Saanjh'}
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-secondary">{form.tagline || 'Your tagline'}</p>
              {form.announcementEnabled && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-bg-card/80 p-3">
                  <Megaphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                  <p className="text-[11px] leading-5 text-ink-secondary">
                    A simulated matrimonial experience — every profile and conversation is sample data.
                  </p>
                </div>
              )}
            </div>
            <div className="border-t border-line p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Support</p>
              <p className="mt-1 text-xs text-ink-primary">{form.supportEmail || 'support@saanjh.example'}</p>
              <p className="mt-2 text-[10px] leading-5 text-ink-muted">
                Saved settings live only in this browser under the <code>saanjh.</code> prefix.
              </p>
            </div>
          </section>

          <section className="card-surface p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              Current demo rules
            </p>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted">Minimum score</dt>
                <dd className="font-medium text-ink-secondary">{form.matching.minScore}%</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted">Max suggestions</dt>
                <dd className="font-medium text-ink-secondary">{form.matching.maxSuggestions}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted">Minimum age</dt>
                <dd className="font-medium text-ink-secondary">{form.registration.minAge}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-ink-muted">Profile review</dt>
                <dd className="font-medium text-ink-secondary">
                  {form.registration.requireProfileReview ? 'Required' : 'Optional'}
                </dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-bg-secondary/60 p-3 text-[10px] leading-5 text-ink-muted">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
              No real member or payment data is present in this demo.
            </p>
          </section>

          <Alert variant="info" title="Production note">
            A real platform should validate these settings server-side and never expose admin
            controls without proper authentication.
          </Alert>
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm === 'all' ? 'Reset the entire demo?' : 'Reset admin configuration?'}
        description={
          confirm === 'all'
            ? 'All Saanjh demo data will be cleared from this browser and the app will reload.'
            : 'Reports, subscription overrides and admin settings will return to their seeded state.'
        }
        confirmLabel={confirm === 'all' ? 'Reset everything' : 'Reset admin data'}
        onConfirm={handleReset}
        onCancel={() => setConfirm('')}
      >
        {confirm === 'all'
          ? 'This also clears profiles, preferences, interests, conversations, notifications and the signed-in demo session.'
          : 'Member profiles and conversations are not affected by this admin-only reset.'}
      </ConfirmDialog>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-line bg-bg-secondary/40 p-4 text-[11px] leading-5 text-ink-muted">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
        Admin settings, like the rest of the console, are simulated. Restore the seeded state with
        “Reset admin data” if a demo needs to start clean.
      </div>
    </div>
  )
}
