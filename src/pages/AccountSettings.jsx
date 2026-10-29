import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Crown,
  LogOut,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Sun,
  Trash2,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { formatDate } from '../utils/format'
import { resetDemoData } from '../utils/demo'
import { removeStorage } from '../utils/storage'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useSubscription } from '../context/SubscriptionContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import { Alert, Badge, PageHeader, Tabs } from '../components/common/ui'
import { ConfirmDialog } from '../components/common/Modal'
import { TextField, Toggle } from '../components/forms/FormControls'

const tabs = [
  { value: 'account', label: 'Account' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'membership', label: 'Membership' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'demo', label: 'Demo & data' },
]

const notificationPreferences = {
  newMatches: true,
  interests: true,
  messages: true,
  membership: true,
  productUpdates: false,
  email: true,
  push: true,
}

const themes = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Warm ivory and rose.' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Deep clay and candlelight.' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow your device setting.' },
]

function SettingsCard({ title, description, children, footer }) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-ink-secondary">{description}</p>}
      </div>
      <div className="mt-5">{children}</div>
      {footer && <div className="mt-5 border-t border-line pt-4">{footer}</div>}
    </section>
  )
}

export default function AccountSettings() {
  usePageMeta('Account settings', 'Manage your Saanjh demo account, privacy, notifications, membership and app theme.')
  const { user, updateUser, logout } = useAuth()
  const { profile, updatePrivacy } = useProfile()
  const { plan, subscription, cancelSubscription } = useSubscription()
  const { mode, setTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()

  const [tab, setTab] = useState('account')
  const [account, setAccount] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [accountErrors, setAccountErrors] = useState({})
  const [preferences, setPreferences] = useLocalStorage(
    `saanjh.notificationPrefs.${user?.id || 'guest'}`,
    notificationPreferences,
  )
  const [confirm, setConfirm] = useState('')

  const privacy = profile?.privacy || {}

  function saveAccount() {
    const next = {}
    if (!account.name.trim()) next.name = 'Name cannot be empty.'
    if (account.phone && account.phone.replace(/\D/g, '').length < 10)
      next.phone = 'Use at least 10 digits for a demo phone number.'
    setAccountErrors(next)
    if (Object.keys(next).length) return
    updateUser({ name: account.name.trim(), phone: account.phone.trim() })
    toast.success('Your demo account details were updated.')
  }

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  function handleCancelMembership() {
    cancelSubscription()
    setConfirm('')
    toast.info('Your demo membership is now marked as cancelled.')
  }

  function handleSignOut() {
    logout()
    toast.info('You signed out of the demo session.')
    navigate('/')
  }

  function handleDeleteAccount() {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('saanjh.') && key.includes(user.id))
      .forEach((key) => removeStorage(key))
    removeStorage(`saanjh.notificationPrefs.${user.id}`)
    removeStorage('saanjh.auth.user')
    logout()
    setConfirm('')
    toast.info('Your local demo account data was deleted from this browser.')
    navigate('/')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="The small, important controls for your demo experience. Everything is stored only in this browser."
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Settings sections" className="mb-5" />

      {tab === 'account' && (
        <div className="space-y-5">
          <SettingsCard
            title="Your account"
            description="These details identify you in the demo. Your email address is read-only here."
            footer={
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={saveAccount} leftIcon={<Save className="h-3.5 w-3.5" />}>
                  Save changes
                </Button>
                <Button to="/profile/edit" variant="secondary" size="sm">
                  Edit profile details
                </Button>
                <Button to="/profile/me" variant="ghost" size="sm">
                  View public profile
                </Button>
              </div>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Display name"
                value={account.name}
                onChange={(event) => {
                  setAccount((current) => ({ ...current, name: event.target.value }))
                  setAccountErrors((current) => ({ ...current, name: '' }))
                }}
                error={accountErrors.name}
                autoComplete="name"
              />
              <TextField
                label="Phone number"
                value={account.phone}
                onChange={(event) => {
                  setAccount((current) => ({ ...current, phone: event.target.value }))
                  setAccountErrors((current) => ({ ...current, phone: '' }))
                }}
                error={accountErrors.phone}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
              <TextField
                label="Email address"
                value={user?.email || ''}
                readOnly
                hint="Email changes are disabled in this front-end demo."
                className="sm:col-span-2"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <Badge tone="neutral" size="sm">Member since {formatDate(user?.joinedAt)}</Badge>
              <Badge tone="warning" size="sm">Simulated account</Badge>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Sign in & security"
            description="Passwords are not stored or verified in this demo. Signing out clears the session from this browser."
            footer={
              <Button variant="secondary" size="sm" onClick={handleSignOut} leftIcon={<LogOut className="h-3.5 w-3.5" />}>
                Sign out
              </Button>
            }
          >
            <Alert variant="info" title="Demo authentication">
              Any valid-looking email and a password of six or more characters works. Never enter a
              real password into this demonstration.
            </Alert>
          </SettingsCard>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="space-y-5">
          <SettingsCard
            title="What others can see"
            description="Choose which details appear on your profile to signed-in members. Changes save immediately for this browser."
          >
            <div className="divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="Annual income"
                description="Show your income range on your profile."
                checked={privacy.showIncome !== false}
                onChange={(value) => updatePrivacy({ showIncome: value })}
              />
              <Toggle
                className="py-3.5"
                label="Family details"
                description="Show family type, values, location and background."
                checked={privacy.showFamily !== false}
                onChange={(value) => updatePrivacy({ showFamily: value })}
              />
              <Toggle
                className="py-3.5"
                label="Lifestyle"
                description="Show diet, smoking and drinking preferences."
                checked={privacy.showLifestyle !== false}
                onChange={(value) => updatePrivacy({ showLifestyle: value })}
              />
              <Toggle
                className="py-3.5 last:pb-0"
                label="Partner preferences on profile"
                description="Let connections see a summary of what you are looking for."
                checked={privacy.showPreferences !== false}
                onChange={(value) => updatePrivacy({ showPreferences: value })}
              />
            </div>
          </SettingsCard>
          <Alert variant="warning" title="Privacy in a front-end demo">
            These toggles demonstrate a privacy experience, but all sample profiles are visible to
            anyone browsing this demo. No real data is involved.
          </Alert>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="space-y-5">
          <SettingsCard
            title="Notification preferences"
            description="Choose what you would like to be notified about. Preferences save automatically in this browser."
          >
            <div className="divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="New matches"
                description="A gentle nudge when new sample profiles fit your preferences."
                checked={preferences.newMatches}
                onChange={(value) => updatePreference('newMatches', value)}
              />
              <Toggle
                className="py-3.5"
                label="Interests"
                description="When someone expresses interest or responds to yours."
                checked={preferences.interests}
                onChange={(value) => updatePreference('interests', value)}
              />
              <Toggle
                className="py-3.5"
                label="Messages"
                description="When a connection sends a simulated message."
                checked={preferences.messages}
                onChange={(value) => updatePreference('messages', value)}
              />
              <Toggle
                className="py-3.5"
                label="Membership updates"
                description="Renewals, cancellations and plan changes."
                checked={preferences.membership}
                onChange={(value) => updatePreference('membership', value)}
              />
              <Toggle
                className="py-3.5 last:pb-0"
                label="Product updates"
                description="Occasional notes about new demo features."
                checked={preferences.productUpdates}
                onChange={(value) => updatePreference('productUpdates', value)}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Channels" description="Purely illustrative — no notification is actually sent.">
            <div className="divide-y divide-line">
              <Toggle
                className="py-3.5 first:pt-0"
                label="Email"
                description="Send demo notifications to your account email (not actually sent)."
                checked={preferences.email}
                onChange={(value) => updatePreference('email', value)}
              />
              <Toggle
                className="py-3.5 last:pb-0"
                label="In-app"
                description="Show notifications inside the demo."
                checked={preferences.push}
                onChange={(value) => updatePreference('push', value)}
              />
            </div>
          </SettingsCard>
        </div>
      )}

      {tab === 'membership' && (
        <div className="space-y-5">
          <SettingsCard title="Your membership" description="Manage the simulated plan attached to this account.">
            <div className="rounded-xl border border-line bg-bg-secondary/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Crown className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-primary">{plan.name} plan</p>
                    <p className="text-xs text-ink-secondary">
                      {subscription.status === 'active' ? 'Active' : subscription.status} ·{' '}
                      {plan.id === 'free' ? 'No billing' : `${formatDate(subscription.startedAt)} onwards`}
                    </p>
                  </div>
                </div>
                <Badge tone={subscription.status === 'active' ? 'success' : 'warning'} size="sm">
                  {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-muted">Billing interval</p>
                  <p className="mt-0.5 font-medium capitalize text-ink-primary">{subscription.interval}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-muted">Simulated renewal</p>
                  <p className="mt-0.5 font-medium text-ink-primary">
                    {subscription.renewsAt ? formatDate(subscription.renewsAt) : 'Not applicable'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button to="/plans" size="sm">
                {plan.id === 'free' ? 'Explore plans' : 'Change plan'}
              </Button>
              {subscription.status === 'active' && plan.id !== 'free' && (
                <Button variant="secondary" size="sm" onClick={() => setConfirm('cancel')}>
                  Cancel membership
                </Button>
              )}
              {subscription.status !== 'active' && (
                <Button to="/plans" variant="secondary" size="sm">
                  Reactivate
                </Button>
              )}
            </div>
          </SettingsCard>
          <Alert variant="warning" title="No real billing">
            No payment method is attached to this account. Membership changes here never result in a
            charge.
          </Alert>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="space-y-5">
          <SettingsCard title="Theme" description="Choose how Saanjh looks. Your preference is remembered in this browser.">
            <div className="grid gap-3 sm:grid-cols-3">
              {themes.map((item) => {
                const Icon = item.icon
                const active = mode === item.value
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTheme(item.value)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-colors',
                      active ? 'border-brand bg-brand/5' : 'border-line bg-bg-card hover:border-brand/30',
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <Icon className={cn('h-5 w-5', active ? 'text-brand' : 'text-ink-muted')} aria-hidden="true" />
                      {active && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-ink-primary">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{item.description}</span>
                  </button>
                )
              })}
            </div>
          </SettingsCard>
          <div className="flex items-start gap-2 rounded-xl border border-line bg-bg-secondary/50 p-4 text-xs leading-5 text-ink-secondary">
            <Palette className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            The demo supports a warm light palette and a low-light dark palette. Your choice applies
            across public and member pages.
          </div>
        </div>
      )}

      {tab === 'demo' && (
        <div className="space-y-5">
          <SettingsCard
            title="Sign out"
            description="End this simulated session. Your demo profile and saved data will remain in this browser."
            footer={
              <Button variant="secondary" size="sm" onClick={handleSignOut} leftIcon={<LogOut className="h-3.5 w-3.5" />}>
                Sign out of demo
              </Button>
            }
          >
            <p className="text-sm leading-6 text-ink-secondary">
              You can sign back in with the demo member or create a new sample profile.
            </p>
          </SettingsCard>

          <SettingsCard
            title="Reset all demo data"
            description="Restore every seeded profile, conversation, interest, membership and admin setting to its original demo state."
            footer={
              <Button variant="danger" size="sm" onClick={() => setConfirm('reset')} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
                Reset everything
              </Button>
            }
          >
            <Alert variant="warning" title="This clears your local changes">
              Your edits, uploaded photos, shortlist and messages will be removed. This cannot be
              undone.
            </Alert>
          </SettingsCard>

          <SettingsCard
            title="Delete this demo account"
            description="Remove your member data from this browser and sign out."
            footer={
              <Button variant="danger" size="sm" onClick={() => setConfirm('delete')} leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
                Delete account data
              </Button>
            }
          >
            <p className="text-sm leading-6 text-ink-secondary">
              This removes the demo profile, preferences, interests, shortlist, conversations,
              notifications and membership associated with this local account. Seeded sample
              profiles remain available for other demo sessions.
            </p>
          </SettingsCard>
        </div>
      )}

      <ConfirmDialog
        open={confirm === 'cancel'}
        title="Cancel your demo membership?"
        description="Your plan will be marked as cancelled. No payment or real subscription is affected."
        confirmLabel="Cancel membership"
        onConfirm={handleCancelMembership}
        onCancel={() => setConfirm('')}
      >
        You can reactivate from the membership page at any time.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === 'reset'}
        title="Reset all demo data?"
        description="Every local change in this demo will be cleared, including admin settings."
        confirmLabel="Reset everything"
        onConfirm={() => {
          resetDemoData()
        }}
        onCancel={() => setConfirm('')}
      >
        The demo will reload with its original sample content.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === 'delete'}
        title="Delete your demo account data?"
        description="This removes your local account and related data from this browser."
        confirmLabel="Delete account data"
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirm('')}
      >
        This cannot be undone. Seeded sample profiles remain available.
      </ConfirmDialog>
    </div>
  )
}
