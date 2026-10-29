import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  Bookmark,
  Crown,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMatch } from '../context/MatchContext'
import { useMessaging } from '../context/MessagingContext'
import { useNotifications } from '../context/NotificationContext'
import { useProfile } from '../context/ProfileContext'
import { useSubscription } from '../context/SubscriptionContext'
import Logo from '../components/common/Logo'
import Drawer from '../components/common/Drawer'
import ThemeToggle from '../components/common/ThemeToggle'
import NotificationBell from '../components/common/NotificationBell'
import UserMenu from '../components/common/UserMenu'
import { Avatar, ProgressBar } from '../components/common/ui'
import { cn } from '../utils/cn'
import { primaryPhoto } from '../utils/profile'

const pageNames = {
  dashboard: 'Overview',
  matches: 'Discover matches',
  search: 'Search profiles',
  shortlist: 'Shortlist',
  interests: 'Interests',
  messages: 'Messages',
  notifications: 'Notifications',
  plans: 'Membership',
  checkout: 'Demo checkout',
  settings: 'Account settings',
  'create-profile': 'Create profile',
  preferences: 'Partner preferences',
  profile: 'Edit profile',
}

const navGroups = [
  {
    label: 'Discover',
    items: [
      { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Matches', to: '/matches', icon: Sparkles },
      { label: 'Search', to: '/search', icon: Search },
      { label: 'Shortlist', to: '/shortlist', icon: Bookmark },
      { label: 'Interests', to: '/interests', icon: HeartHandshake, badge: 'interests' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { label: 'Messages', to: '/messages', icon: MessageCircle, badge: 'messages' },
      { label: 'Notifications', to: '/notifications', icon: Bell, badge: 'notifications' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'My profile', to: '/profile/edit', icon: UserRound },
      { label: 'Partner preferences', to: '/preferences', icon: SlidersHorizontal },
      { label: 'Membership', to: '/plans', icon: Crown },
      { label: 'Settings', to: '/settings', icon: Settings },
    ],
  },
]

function getPageName(pathname) {
  const segment = pathname.split('/').filter(Boolean)[0] || 'dashboard'
  return pageNames[segment] || 'Member area'
}

function SidebarContent({ onNavigate }) {
  const { user, isAdmin } = useAuth()
  const { profile, completeness } = useProfile()
  const { pendingReceived } = useMatch()
  const { unreadTotal } = useMessaging()
  const { unreadCount } = useNotifications()
  const { plan, subscription } = useSubscription()

  const badges = {
    interests: pendingReceived.length,
    messages: unreadTotal,
    notifications: unreadCount,
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-5">
        <Logo to="/dashboard" />
        {onNavigate && (
          <button type="button" onClick={onNavigate} className="btn-icon lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-line px-4 py-4">
        <Link
          to="/profile/edit"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-bg-secondary"
        >
          <Avatar src={primaryPhoto(profile)} name={profile?.displayName || user?.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-primary">
              {profile?.displayName || user?.name}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              Profile complete · {completeness.percent}%
            </p>
            <ProgressBar value={completeness.percent} size="sm" className="mt-1.5" label="Profile completeness" />
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Member navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const count = item.badge ? badges[item.badge] : 0
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-brand/10 text-brand'
                            : 'text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary',
                        )
                      }
                    >
                      <item.icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {count > 9 ? '9+' : count}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        {isAdmin && (
          <div className="mb-2 border-t border-line pt-3">
            <NavLink
              to="/admin"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
            >
              <ShieldCheck className="h-[17px] w-[17px]" aria-hidden="true" />
              Demo admin panel
            </NavLink>
          </div>
        )}
      </nav>

      <div className="border-t border-line p-4">
        <div className="rounded-xl border border-line bg-bg-secondary/60 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Membership
            </span>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
              {plan.name}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-ink-secondary">
            {subscription.status === 'active'
              ? `${plan.tagline} Simulated ${subscription.interval} billing.`
              : 'Your demo membership is cancelled. Reactivate any time.'}
          </p>
          <Link
            to="/plans"
            onClick={onNavigate}
            className="mt-2.5 inline-flex text-xs font-semibold text-brand hover:text-brand-hover"
          >
            {plan.id === 'premium' ? 'Manage membership' : 'Explore upgrades'} →
          </Link>
        </div>
        <Link
          to="/"
          onClick={onNavigate}
          className="mt-3 flex items-center justify-center rounded-lg px-3 py-2 text-[11px] font-medium text-ink-muted transition-colors hover:bg-bg-secondary hover:text-ink-primary"
        >
          View public site
        </Link>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-bg-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line bg-bg-card lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/85">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn-icon lg:hidden"
              aria-label="Open member navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">
                Member area
              </p>
              <p className="truncate text-sm font-semibold text-ink-primary">{getPageName(location.pathname)}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </header>

        <main id="main-content" className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        width="max-w-[300px]"
        title="Member navigation"
        hideHeader
        bodyClassName="flex-1 overflow-y-auto"
      >
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </div>
  )
}
