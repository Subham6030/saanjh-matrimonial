import { useMemo, useState } from 'react'
import { Heart, MapPin, RotateCcw, Save, ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'
import { normalizePreferences } from '../utils/profile'
import { strictMismatch } from '../utils/compatibility'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { profiles } from '../data/profiles'
import {
  cities,
  diets,
  drinkingOptions,
  educationLevels,
  heights,
  languages,
  lookingForOptions,
  maritalStatuses,
  professionCategories,
  religions,
  smokingOptions,
} from '../data/options'
import Button from '../components/common/Button'
import { ConfirmDialog } from '../components/common/Modal'
import { Alert, Badge, PageHeader } from '../components/common/ui'
import {
  FormSection,
  OptionChips,
  SelectField,
  TextField,
  Toggle,
} from '../components/forms/FormControls'

const strictOptions = [
  { key: 'age', label: 'Age range', description: 'Only show profiles within your chosen age range.' },
  { key: 'maritalStatus', label: 'Marital status', description: 'Respect the statuses you have selected.' },
  { key: 'location', label: 'Location', description: 'Only include profiles in your preferred cities.' },
  { key: 'education', label: 'Education', description: 'Limit to the education levels you chose.' },
  { key: 'religion', label: 'Religion', description: 'Only show profiles matching your selected faiths.' },
  { key: 'languages', label: 'Languages', description: 'Require at least one shared language.' },
  { key: 'diet', label: 'Diet', description: 'Keep results within your selected diets.' },
]

function LookingForCards({ value, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Looking for">
      {lookingForOptions.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
              active
                ? 'border-brand bg-brand/5 text-ink-primary'
                : 'border-line bg-bg-card text-ink-secondary hover:border-brand/30',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                active ? 'bg-brand text-white' : 'bg-bg-secondary text-ink-muted',
              )}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink-primary">{value}</span>
    </div>
  )
}

export default function PartnerPreferences() {
  usePageMeta(
    'Partner preferences',
    'Shape who you would like to meet. Save age, location, community and lifestyle preferences for the Saanjh demo.',
  )
  const { preferences, savePreferences, resetPreferences } = useProfile()
  const toast = useToast()

  const [form, setForm] = useState(() => normalizePreferences(preferences))
  const [errors, setErrors] = useState({})
  const [resetOpen, setResetOpen] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function updateStrict(key, value) {
    setForm((current) => ({
      ...current,
      strict: { ...current.strict, [key]: value },
    }))
  }

  const estimate = useMemo(
    () =>
      profiles.filter(
        (profile) => profile.gender === form.lookingFor && !strictMismatch(profile, form),
      ).length,
    [form],
  )

  const activeStrict = Object.values(form.strict || {}).filter(Boolean).length

  function validate() {
    const next = {}
    const ageMin = Number(form.ageMin)
    const ageMax = Number(form.ageMax)

    if (!form.ageMin) next.ageMin = 'Enter a minimum age.'
    else if (ageMin < 18 || ageMin > 80) next.ageMin = 'Use an age between 18 and 80.'
    if (!form.ageMax) next.ageMax = 'Enter a maximum age.'
    else if (ageMax < 18 || ageMax > 80) next.ageMax = 'Use an age between 18 and 80.'
    if (!next.ageMin && !next.ageMax && ageMin > ageMax)
      next.ageMin = 'The minimum age cannot be higher than the maximum.'

    if (!form.heightMin) next.heightMin = 'Choose a minimum height.'
    if (!form.heightMax) next.heightMax = 'Choose a maximum height.'
    if (!next.heightMin && !next.heightMax && Number(form.heightMin) > Number(form.heightMax))
      next.heightMin = 'The minimum height cannot be higher than the maximum.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave() {
    if (!validate()) {
      toast.error('Please fix the highlighted preference ranges.')
      return
    }
    savePreferences(form)
    toast.success('Your partner preferences are saved for this demo.', {
      title: 'Preferences saved',
    })
  }

  function handleReset() {
    const defaults = resetPreferences()
    setForm(normalizePreferences(defaults))
    setErrors({})
    setResetOpen(false)
    toast.success('Preferences reset to the demo defaults.', { title: 'Preferences reset' })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Match preferences"
        title="Design your search"
        description="Set the boundaries that matter and keep the rest open. You can change these at any time."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setResetOpen(true)}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} leftIcon={<Save className="h-3.5 w-3.5" />}>
              Save preferences
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <FormSection
            title="Who you would like to meet"
            description="This is the first filter we apply to every suggestion."
          >
            <LookingForCards value={form.lookingFor} onChange={(value) => update('lookingFor', value)} />
          </FormSection>

          <FormSection
            title="Age & height"
            description="Compatibility is strongest when your range reflects what you genuinely want."
          >
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Minimum age"
                type="number"
                min={18}
                max={80}
                value={form.ageMin}
                onChange={(event) => update('ageMin', event.target.value)}
                error={errors.ageMin}
                required
              />
              <TextField
                label="Maximum age"
                type="number"
                min={18}
                max={80}
                value={form.ageMax}
                onChange={(event) => update('ageMax', event.target.value)}
                error={errors.ageMax}
                required
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <SelectField
                label="Minimum height"
                value={form.heightMin || ''}
                onChange={(event) => update('heightMin', Number(event.target.value))}
                error={errors.heightMin}
                required
              >
                {heights.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Maximum height"
                value={form.heightMax || ''}
                onChange={(event) => update('heightMax', Number(event.target.value))}
                error={errors.heightMax}
                required
              >
                {heights.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </SelectField>
            </div>
            {(errors.ageMin || errors.ageMax) && (
              <Alert variant="error" className="mt-3">
                Please make sure your age range is the right way around and between 18 and 80.
              </Alert>
            )}
          </FormSection>

          <FormSection
            title="Location & community"
            description="Leave these blank to stay open to matches anywhere."
          >
            <p className="label-base">Preferred cities</p>
            <OptionChips
              options={cities}
              value={form.locations}
              onChange={(value) => update('locations', value)}
              ariaLabel="Preferred cities"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-ink-muted">
              {form.locations.length
                ? `${form.locations.length} ${form.locations.length === 1 ? 'city' : 'cities'} selected`
                : 'No city selected — open to all locations.'}
            </p>

            <div className="mt-6 border-t border-line pt-5">
              <p className="label-base">Religion</p>
              <OptionChips
                options={religions}
                value={form.religions}
                onChange={(value) => update('religions', value)}
                ariaLabel="Preferred religions"
                className="mt-2"
              />
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="label-base">Languages</p>
              <OptionChips
                options={languages}
                value={form.languages}
                onChange={(value) => update('languages', value)}
                ariaLabel="Preferred languages"
                className="mt-2"
              />
            </div>
          </FormSection>

          <FormSection
            title="Background & lifestyle"
            description="Optional filters. Select nothing to keep this part of your search open."
          >
            <p className="label-base">Education</p>
            <OptionChips
              options={educationLevels}
              value={form.education}
              onChange={(value) => update('education', value)}
              ariaLabel="Preferred education"
              className="mt-2"
            />

            <p className="label-base mt-5">Profession</p>
            <OptionChips
              options={professionCategories}
              value={form.professions}
              onChange={(value) => update('professions', value)}
              ariaLabel="Preferred professions"
              className="mt-2"
            />

            <p className="label-base mt-5">Marital status</p>
            <OptionChips
              options={maritalStatuses}
              value={form.maritalStatuses}
              onChange={(value) => update('maritalStatuses', value)}
              ariaLabel="Preferred marital statuses"
              className="mt-2"
            />

            <p className="label-base mt-5">Diet</p>
            <OptionChips
              options={diets}
              value={form.diets}
              onChange={(value) => update('diets', value)}
              ariaLabel="Preferred diets"
              className="mt-2"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Smoking"
                value={form.smoking}
                onChange={(event) => update('smoking', event.target.value)}
                placeholder="No preference"
              >
                {smokingOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Drinking"
                value={form.drinking}
                onChange={(event) => update('drinking', event.target.value)}
                placeholder="No preference"
              >
                {drinkingOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectField>
            </div>
          </FormSection>

          <FormSection
            title="Strict filters"
            description="Turn a preference into a firm boundary. Strict filters can shrink your matches considerably."
            actions={
              <Badge tone={activeStrict ? 'brand' : 'neutral'} size="sm">
                {activeStrict} active
              </Badge>
            }
          >
            <div className="divide-y divide-line">
              {strictOptions.map((item) => (
                <Toggle
                  key={item.key}
                  className="py-3.5 first:pt-0 last:pb-0"
                  label={item.label}
                  description={item.description}
                  checked={Boolean(form.strict?.[item.key])}
                  onChange={(value) => updateStrict(item.key, value)}
                />
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-bg-secondary/60 p-3 text-xs leading-5 text-ink-secondary">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              Strict filters only affect suggestions. Profiles outside them can still appear in search
              unless you apply the filter there.
            </div>
          </FormSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Estimated fit
                </p>
                <p className="font-display text-2xl text-ink-primary">
                  {estimate} {estimate === 1 ? 'profile' : 'profiles'}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-ink-secondary">
              Of the 24 sample profiles, this is how many currently pass your strict filters. This
              is illustrative, not a promise of real matches.
            </p>
            <div className="mt-4 divide-y divide-line border-t border-line">
              <SummaryRow
                label="Looking for"
                value={lookingForOptions.find((item) => item.value === form.lookingFor)?.label}
              />
              <SummaryRow label="Age" value={`${form.ageMin}–${form.ageMax} years`} />
              <SummaryRow label="Height" value={`${form.heightMin}–${form.heightMax} cm`} />
              <SummaryRow
                label="Cities"
                value={form.locations.length ? form.locations.join(', ') : 'Open to all'}
              />
              <SummaryRow label="Religions" value={form.religions.length ? form.religions.join(', ') : 'Open to all'} />
            </div>
          </div>

          <div className="card-surface p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" /> Prefer to browse?
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-secondary">
              Saved preferences shape your matches, but you can always explore every profile from
              search.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button to="/search" variant="secondary" size="sm">
                Browse profiles
              </Button>
              <Button to="/matches" variant="ghost" size="sm">
                View matches
              </Button>
            </div>
          </div>

          <div className="card-surface p-5">
            <Button fullWidth onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>
              Save preferences
            </Button>
            <Button
              fullWidth
              variant="ghost"
              className="mt-2"
              onClick={() => setResetOpen(true)}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset to defaults
            </Button>
            <p className="mt-3 text-center text-[11px] leading-5 text-ink-muted">
              Stored only in this browser.
            </p>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset your preferences?"
        description="This restores the demo defaults. You can adjust them again afterwards."
        confirmLabel="Reset preferences"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      >
        Any custom age, location and lifestyle preferences you have saved will be replaced.
      </ConfirmDialog>
    </div>
  )
}
