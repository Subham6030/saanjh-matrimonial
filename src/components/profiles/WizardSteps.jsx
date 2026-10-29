import { useRef, useState } from 'react'
import {
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  Heart,
  ImagePlus,
  MapPin,
  Pencil,
  Star,
  Trash2,
  Upload,
  UserRound,
  Users,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { calculateAge, heightLabel } from '../../utils/format'
import { profileCompleteness } from '../../utils/profile'
import { imageFileToDataUrl } from '../../utils/image'
import {
  cityOptions,
  countries,
  diets,
  drinkingOptions,
  educationLevels,
  familyTypes,
  familyValues,
  genders,
  heights,
  incomeRanges,
  interestsList,
  languages,
  maritalStatuses,
  motherTongues,
  professionCategories,
  profileForOptions,
  religions,
  smokingOptions,
  states,
} from '../../data/options'
import SmartImage from '../common/SmartImage'
import { Alert, Badge, ProgressBar, ProgressRing } from '../common/ui'
import {
  FormSection,
  OptionChips,
  SelectField,
  TextField,
  TextareaField,
} from '../forms/FormControls'

export const WIZARD_STEPS = [
  { id: 'basics', label: 'Basics', icon: UserRound, title: 'Tell us the essentials', description: 'The details that help someone put a name, age and story to your profile.' },
  { id: 'career', label: 'Career', icon: Briefcase, title: 'Your work and learning', description: 'Share what you do and what you have studied. Keep it honest and simple.' },
  { id: 'personal', label: 'Personality', icon: Heart, title: 'The things that make you, you', description: 'A little about your everyday rhythm, the interests you light up about and how you like to live.' },
  { id: 'family', label: 'Family', icon: Users, title: 'Your family roots', description: 'A warm snapshot of home life and the values that shaped you.' },
  { id: 'location', label: 'Location', icon: MapPin, title: 'Where life happens', description: 'Your city, community and mother tongue help us suggest more relevant matches.' },
  { id: 'photos', label: 'Photos', icon: Camera, title: 'Add a face to the story', description: 'Upload one to four photos. They stay in your browser and are never sent anywhere in this demo.' },
  { id: 'review', label: 'Review', icon: BadgeCheck, title: 'One last look', description: 'Review your details, fix anything that doesn’t feel right, then publish your profile.' },
]

function StepIntro({ step, children }) {
  const current = WIZARD_STEPS[step]
  return (
    <div>
      <p className="eyebrow">Step {step + 1} of {WIZARD_STEPS.length}</p>
      <h2 className="mt-2 font-display text-2xl text-ink-primary sm:text-[28px]">{current.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">{current.description}</p>
      {children}
    </div>
  )
}

function BasicStep({ form, update, errors }) {
  const age = calculateAge(form.dob)
  return (
    <div>
      <StepIntro step={0} />
      <FormSection title="Your basics" description="This appears on your profile card. Your exact date of birth is only used to show your age." className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            value={form.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
            placeholder="e.g. Aanya"
            maxLength={40}
            required
          />
          <TextField
            label="Last name"
            value={form.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
            placeholder="e.g. Verma"
            maxLength={40}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <TextField
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={(event) => update('dob', event.target.value)}
              error={errors.dob}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
            {age !== null && (
              <p className="mt-1.5 text-xs text-ink-muted">
                You will appear as <span className="font-semibold text-ink-secondary">{age} years old</span>.
              </p>
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
            {genders.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Marital status"
            value={form.maritalStatus}
            onChange={(event) => update('maritalStatus', event.target.value)}
            error={errors.maritalStatus}
            placeholder="Select status"
            required
          >
            {maritalStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Managed by"
            value={form.managedBy}
            onChange={(event) => update('managedBy', event.target.value)}
            error={errors.managedBy}
          >
            {profileForOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          label="Profile headline"
          value={form.headline}
          onChange={(event) => update('headline', event.target.value)}
          error={errors.headline}
          placeholder="A sentence that captures your everyday spirit."
          hint={`${form.headline.length}/90 characters — a good headline is warm, specific and easy to remember.`}
          maxLength={90}
          className="mt-4"
          required
        />
      </FormSection>
    </div>
  )
}

function CareerStep({ form, update, errors }) {
  return (
    <div>
      <StepIntro step={1} />
      <FormSection title="Education & career" description="You can keep income private later in account settings." className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Highest education"
            value={form.education}
            onChange={(event) => update('education', event.target.value)}
            error={errors.education}
            placeholder="Select education"
            required
          >
            {educationLevels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <TextField
            label="College or qualification"
            value={form.educationDetail}
            onChange={(event) => update('educationDetail', event.target.value)}
            error={errors.educationDetail}
            placeholder="e.g. M.Des, IIT Bombay"
            maxLength={80}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Profession"
            value={form.profession}
            onChange={(event) => update('profession', event.target.value)}
            error={errors.profession}
            placeholder="e.g. Product Designer"
            maxLength={60}
            required
          />
          <SelectField
            label="Profession category"
            value={form.professionCategory}
            onChange={(event) => update('professionCategory', event.target.value)}
            error={errors.professionCategory}
            placeholder="Select category"
          >
            {professionCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Company or workplace"
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
            error={errors.company}
            placeholder="e.g. Studio Lumen"
            maxLength={70}
          />
          <SelectField
            label="Annual income"
            value={form.income}
            onChange={(event) => update('income', event.target.value)}
            error={errors.income}
            placeholder="Prefer not to say"
          >
            {incomeRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>
      </FormSection>
    </div>
  )
}

function PersonalStep({ form, update, errors }) {
  return (
    <div>
      <StepIntro step={2} />
      <FormSection title="A little more about you" description="Specific details make a profile feel human. Choose what genuinely fits." className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Height"
            value={form.heightCm || ''}
            onChange={(event) => update('heightCm', event.target.value ? Number(event.target.value) : '')}
            error={errors.heightCm}
            placeholder="Select height"
            required
          >
            {heights.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Diet"
            value={form.diet}
            onChange={(event) => update('diet', event.target.value)}
            error={errors.diet}
            placeholder="Select diet"
          >
            {diets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Smoking"
            value={form.smoking}
            onChange={(event) => update('smoking', event.target.value)}
            error={errors.smoking}
            placeholder="Prefer not to say"
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
            error={errors.drinking}
            placeholder="Prefer not to say"
          >
            {drinkingOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="label-base">Languages you speak</p>
            <span className="text-[11px] text-ink-muted">{form.languages.length} selected</span>
          </div>
          <OptionChips
            options={languages}
            value={form.languages}
            onChange={(value) => update('languages', value)}
            ariaLabel="Languages you speak"
            className="mt-2"
          />
          {errors.languages && <p className="mt-1.5 text-xs font-medium text-error">{errors.languages}</p>}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="label-base">Interests</p>
            <span className={cn('text-[11px]', form.interests.length > 10 ? 'text-warning' : 'text-ink-muted')}>
              {form.interests.length}/10 selected
            </span>
          </div>
          <OptionChips
            options={interestsList}
            value={form.interests.slice(0, 10)}
            onChange={(value) => update('interests', value.slice(0, 10))}
            ariaLabel="Interests"
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-ink-muted">Choose at least two. Up to ten helps keep the focus.</p>
          {errors.interests && <p className="mt-1.5 text-xs font-medium text-error">{errors.interests}</p>}
        </div>

        <TextareaField
          label="Your story"
          value={form.bio}
          onChange={(event) => update('bio', event.target.value)}
          error={errors.bio}
          hint={`${form.bio.length}/600 characters — write in your own voice. Mention what matters to you and what a good day looks like.`}
          placeholder="A few honest lines about your life, your people and what you're looking for…"
          maxLength={600}
          rows={5}
          className="mt-5"
          required
        />
      </FormSection>
    </div>
  )
}

function FamilyStep({ form, updateFamily, errors }) {
  return (
    <div>
      <StepIntro step={3} />
      <FormSection title="Your family" description="Family details are optional but help matches understand your world. You can hide them later." className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Family type"
            value={form.family?.type || ''}
            onChange={(event) => updateFamily('type', event.target.value)}
            error={errors.familyType}
            placeholder="Select family type"
          >
            {familyTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Family values"
            value={form.family?.values || ''}
            onChange={(event) => updateFamily('values', event.target.value)}
            error={errors.familyValues}
            placeholder="Select values"
          >
            {familyValues.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          label="Family location"
          value={form.family?.location || ''}
          onChange={(event) => updateFamily('location', event.target.value)}
          error={errors.familyLocation}
          placeholder="e.g. Mumbai"
          maxLength={60}
          className="mt-4"
        />

        <TextareaField
          label="About your family"
          value={form.family?.about || ''}
          onChange={(event) => updateFamily('about', event.target.value)}
          error={errors.familyAbout}
          hint={`${(form.family?.about || '').length}/300 characters`}
          placeholder="A sentence or two about the people you grew up with, what they do and what home feels like."
          maxLength={300}
          rows={4}
          className="mt-4"
        />
      </FormSection>
    </div>
  )
}

function LocationStep({ form, update, errors }) {
  const isIndia = form.country === 'India'

  function handleCityChange(city) {
    update('city', city)
    const match = cityOptions.find((item) => item.city === city)
    if (match) update('state', match.state)
  }

  return (
    <div>
      <StepIntro step={4} />
      <FormSection title="Location & community" description="This helps us prioritise nearby and culturally compatible matches." className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Country"
            value={form.country}
            onChange={(event) => {
              update('country', event.target.value)
              if (event.target.value !== 'India') {
                update('state', '')
                update('city', '')
              }
            }}
            error={errors.country}
            required
          >
            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>

          {isIndia ? (
            <SelectField
              label="State"
              value={form.state}
              onChange={(event) => update('state', event.target.value)}
              error={errors.state}
              placeholder="Select state"
              required
            >
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
          ) : (
            <TextField
              label="State or region"
              value={form.state}
              onChange={(event) => update('state', event.target.value)}
              error={errors.state}
              placeholder="e.g. Dubai"
              maxLength={60}
              required
            />
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {isIndia ? (
            <SelectField
              label="City"
              value={form.city}
              onChange={(event) => handleCityChange(event.target.value)}
              error={errors.city}
              placeholder="Select city"
              required
            >
              {cityOptions.map((item) => (
                <option key={item.city} value={item.city}>
                  {item.city}
                </option>
              ))}
            </SelectField>
          ) : (
            <TextField
              label="City"
              value={form.city}
              onChange={(event) => update('city', event.target.value)}
              error={errors.city}
              placeholder="e.g. Dubai"
              maxLength={60}
              required
            />
          )}
          <SelectField
            label="Religion"
            value={form.religion}
            onChange={(event) => update('religion', event.target.value)}
            error={errors.religion}
            placeholder="Select religion"
          >
            {religions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Community or caste"
            value={form.community}
            onChange={(event) => update('community', event.target.value)}
            error={errors.community}
            hint="Optional. Share only if it matters to you."
            placeholder="e.g. Kayastha"
            maxLength={50}
          />
          <SelectField
            label="Mother tongue"
            value={form.motherTongue}
            onChange={(event) => update('motherTongue', event.target.value)}
            error={errors.motherTongue}
            placeholder="Select language"
          >
            {motherTongues.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>
      </FormSection>
    </div>
  )
}

function PhotoCard({ src, alt, primary, onMakePrimary, onRemove, className }) {
  return (
    <div className={cn('group relative overflow-hidden rounded-2xl border border-line bg-bg-secondary', className)}>
      <SmartImage src={src} alt={alt} className="h-full w-full" />
      {primary && (
        <span className="absolute left-2 top-2">
          <Badge tone="dark" size="sm">
            <Star className="h-3 w-3" aria-hidden="true" /> Main photo
          </Badge>
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2.5">
        {!primary ? (
          <button
            type="button"
            onClick={onMakePrimary}
            className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-ink-primary shadow-sm transition-transform hover:scale-105"
          >
            Make main
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full bg-black/45 p-1.5 text-white transition-colors hover:bg-error"
          aria-label={`Remove ${alt}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function PhotosStep({ form, update }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const photos = form.photos || []

  async function handleFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    if (photos.length >= 4) {
      setPhotoError('You can upload up to four photos.')
      return
    }

    setUploading(true)
    setPhotoError('')
    const remaining = 4 - photos.length
    const next = [...photos]
    const failures = []

    for (const file of files.slice(0, remaining)) {
      try {
        const dataUrl = await imageFileToDataUrl(file)
        next.push(dataUrl)
      } catch (error) {
        failures.push(error.message)
      }
    }

    if (next.length !== photos.length) update('photos', next)
    if (files.length > remaining) failures.push('Only the first four photos were kept.')
    setPhotoError(failures.join(' '))
    setUploading(false)
  }

  function removePhoto(index) {
    update(
      'photos',
      photos.filter((_, itemIndex) => itemIndex !== index),
    )
    setPhotoError('')
  }

  function makePrimary(index) {
    const next = [...photos]
    const [selected] = next.splice(index, 1)
    update('photos', [selected, ...next])
  }

  return (
    <div>
      <StepIntro step={5} />
      <FormSection
        title="Profile photos"
        description="A clear, friendly portrait is the best place to start. JPG, PNG or WebP up to 6 MB; images are compressed locally."
        className="mt-6"
        actions={<Badge tone="neutral" size="sm">{photos.length}/4 photos</Badge>}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          className="sr-only"
          aria-label="Upload profile photos"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {photos[0] ? (
            <PhotoCard
              src={photos[0]}
              alt="Main profile photo"
              primary
              onRemove={() => removePhoto(0)}
              className="aspect-[4/3] sm:aspect-[4/5]"
            />
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-bg-secondary/50 px-6 text-center transition-colors hover:border-brand/40 hover:bg-brand/5 sm:aspect-[4/5]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-ink-primary">Add your main photo</span>
              <span className="text-xs leading-5 text-ink-muted">
                A warm, uncluttered portrait works best.
              </span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-2">
            {photos.slice(1).map((photo, index) => (
              <PhotoCard
                key={`${photo.slice(0, 40)}-${index}`}
                src={photo}
                alt={`Profile photo ${index + 2}`}
                onMakePrimary={() => makePrimary(index + 1)}
                onRemove={() => removePhoto(index + 1)}
                className="aspect-square"
              />
            ))}
            {photos.length < 4 && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line bg-bg-secondary/50 text-ink-muted transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-50"
              >
                <Upload className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-semibold">Add photo</span>
              </button>
            )}
          </div>
        </div>

        {uploading && <p className="mt-3 text-xs font-medium text-brand">Preparing your photo…</p>}
        {photoError && (
          <Alert variant="error" className="mt-3">
            {photoError}
          </Alert>
        )}

        <div className="mt-4 rounded-xl border border-line bg-bg-secondary/50 p-3.5">
          <p className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
            This is a front-end demo
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Photos are stored only in this browser using localStorage. They are not uploaded to a
            server, and you can remove them at any time.
          </p>
        </div>
      </FormSection>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink-primary">{value || <span className="text-ink-muted">Not added</span>}</dd>
    </div>
  )
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <section className="rounded-2xl border border-line bg-bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-hover"
        >
          <Pencil className="h-3 w-3" aria-hidden="true" /> Edit
        </button>
      </div>
      <dl className="mt-2 divide-y divide-line/70">{children}</dl>
    </section>
  )
}

function ReviewStep({ form, onEdit }) {
  const completeness = profileCompleteness({
    ...form,
    displayName: [form.firstName, form.lastName].filter(Boolean).join(' '),
  })
  const age = calculateAge(form.dob)

  return (
    <div>
      <StepIntro step={6} />

      <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="card-surface flex items-center justify-center p-5">
          <ProgressRing value={completeness.percent} size={104} />
        </div>
        <div className="card-surface p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-ink-primary">Profile strength</h3>
            <Badge tone={completeness.percent >= 80 ? 'success' : 'warning'} size="sm">
              {completeness.complete} of {completeness.total} essentials
            </Badge>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-ink-secondary">
            {completeness.missing.length === 0
              ? 'Everything essential is in place. Your profile is ready to publish.'
              : `A few additions would make your profile feel more complete: ${completeness.missing.join(', ')}.`}
          </p>
          <ProgressBar value={completeness.percent} className="mt-4" size="sm" />
          {!form.photos?.length && (
            <p className="mt-3 text-xs leading-5 text-warning">
              Tip: profiles with a main photo feel more personal. You can publish now and add one later.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ReviewSection title="Basics" onEdit={() => onEdit(0)}>
          <ReviewRow label="Name" value={[form.firstName, form.lastName].filter(Boolean).join(' ')} />
          <ReviewRow label="Age" value={age ? `${age} years` : ''} />
          <ReviewRow label="Gender" value={genders.find((item) => item.value === form.gender)?.label} />
          <ReviewRow label="Marital status" value={form.maritalStatus} />
          <ReviewRow label="Managed by" value={form.managedBy} />
          <ReviewRow label="Headline" value={form.headline} />
        </ReviewSection>

        <ReviewSection title="Education & career" onEdit={() => onEdit(1)}>
          <ReviewRow label="Education" value={[form.education, form.educationDetail].filter(Boolean).join(' · ')} />
          <ReviewRow label="Profession" value={form.profession} />
          <ReviewRow label="Company" value={form.company} />
          <ReviewRow label="Income" value={form.income} />
        </ReviewSection>

        <ReviewSection title="Personality" onEdit={() => onEdit(2)}>
          <ReviewRow label="Height" value={heightLabel(form.heightCm)} />
          <ReviewRow label="Languages" value={form.languages.join(', ')} />
          <ReviewRow label="Interests" value={form.interests.join(', ')} />
          <ReviewRow label="Diet" value={form.diet} />
          <ReviewRow label="Lifestyle" value={[form.smoking && `Smoking: ${form.smoking}`, form.drinking && `Drinking: ${form.drinking}`].filter(Boolean).join(' · ')} />
          <ReviewRow label="About" value={form.bio} />
        </ReviewSection>

        <ReviewSection title="Family" onEdit={() => onEdit(3)}>
          <ReviewRow label="Family type" value={form.family?.type} />
          <ReviewRow label="Values" value={form.family?.values} />
          <ReviewRow label="Location" value={form.family?.location} />
          <ReviewRow label="About" value={form.family?.about} />
        </ReviewSection>

        <ReviewSection title="Location & community" onEdit={() => onEdit(4)}>
          <ReviewRow label="Location" value={[form.city, form.state, form.country].filter(Boolean).join(', ')} />
          <ReviewRow label="Religion" value={form.religion} />
          <ReviewRow label="Community" value={form.community} />
          <ReviewRow label="Mother tongue" value={form.motherTongue} />
        </ReviewSection>

        <ReviewSection title="Photos" onEdit={() => onEdit(5)}>
          <div className="py-3">
            {form.photos?.length ? (
              <div className="grid grid-cols-4 gap-2">
                {form.photos.map((photo, index) => (
                  <SmartImage
                    key={`${photo.slice(0, 40)}-${index}`}
                    src={photo}
                    alt={`Profile photo ${index + 1}`}
                    className="aspect-square w-full rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">No photos added yet.</p>
            )}
          </div>
        </ReviewSection>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-bg-secondary/50 p-4 text-xs leading-6 text-ink-secondary">
        By publishing, you confirm this is fictional demo content and that no real personal data
        should be entered. You can edit or clear everything later in account settings.
      </div>
    </div>
  )
}

export function WizardStep({ step, ...props }) {
  switch (step) {
    case 0:
      return <BasicStep {...props} />
    case 1:
      return <CareerStep {...props} />
    case 2:
      return <PersonalStep {...props} />
    case 3:
      return <FamilyStep {...props} />
    case 4:
      return <LocationStep {...props} />
    case 5:
      return <PhotosStep {...props} />
    case 6:
      return <ReviewStep {...props} />
    default:
      return null
  }
}
