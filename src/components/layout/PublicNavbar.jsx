import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bookmark,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useMessaging } from '../../context/MessagingContext'
import { useMatch } from '../../context/MatchContext'
import { useToast } from '../../context/ToastContext'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'
import NotificationBell from '../common/NotificationBell'
import UserMenu from '../common/UserMenu'
import Drawer from '../common/Drawer'
import Button from '../common/Button'
import { cn } from '../../utils/cn'

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Matches', to: '/matches' },
  { label: 'Search', to: '/search' },
  { label: 'Membership', to: '/plans' },
]

const accountLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My profile', to: '/profile/edit', icon: UserRound },
  { label: 'Partner preferences', to: '/partner-preferences', icon: SlidersHorizontal },
  { label: 'Shortlist', to: '/shortlist', icon: Bookmark },
  { label: 'Interests', to: '/interests', icon: Heart },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function navClass({ isActive }) {
  return cn(
    'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand/10 text-brand'
      : 'text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary',
  )
}

export default function PublicNavbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { unreadTotal } = useMessaging()
  const { pendingReceived } = useMatch()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  function handleSignOut() {
    logout()
    setOpen(false)
    toast.info('You have signed out of the demo session.')
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/85">
        <div className="container-page flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className="btn-icon relative hidden sm:inline-flex"
                  aria-label={`Messages${unreadTotal ? `, ${unreadTotal} unread` : ''}`}
                  title="Messages"
                >
                  <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
                  {unreadTotal > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white ring-2 ring-bg-primary">
                      {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                  )}
                </Link>
                <NotificationBell className="hidden sm:inline-flex" />
                <UserMenu className="hidden lg:block" />
                <Button to="/dashboard" size="sm" className="hidden lg:inline-flex">
                  My dashboard
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary sm:inline-flex"
                >
                  Sign in
                </Link>
                <Button to="/register" size="sm" className="hidden sm:inline-flex">
                  Join now
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-icon lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="right">
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-bg-secondary/60 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">Demo experience</p>
            <p className="mt-1 text-sm leading-6 text-ink-secondary">
              {user
                ? `Signed in as ${user.name}. Explore the member experience.`
                : 'All profiles and conversations are sample data.'}
            </p>
          </div>

          <nav aria-label="Mobile primary">
            <ul className="space-y-1">
              {primaryLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors',
                        isActive ? 'bg-brand/10 text-brand' : 'text-ink-secondary hover:bg-bg-secondary',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {isAuthenticated && (
            <nav aria-label="Account">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">
                Your account
              </p>
              <ul className="space-y-1">
                {accountLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-brand/10 text-brand'
                            : 'text-ink-secondary hover:bg-bg-secondary hover:text-ink-primary',
                        )
                      }
                    >
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                      {link.to === '/messages' && unreadTotal > 0 && (
                        <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                          {unreadTotal}
                        </span>
                      )}
                      {link.to === '/interests' && pendingReceived.length > 0 && (
                        <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                          {pendingReceived.length}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
                {isAdmin && (
                  <li>
                    <NavLink
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
                    >
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      Admin dashboard
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          )}

          <div className="space-y-2 border-t border-line pt-4">
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <span className="text-sm font-medium text-ink-secondary">Appearance</span>
              <ThemeToggle showLabel />
            </div>
            {isAuthenticated ? (
              <>
                <Button to="/dashboard" fullWidth onClick={() => setOpen(false)}>
                  Go to dashboard
                </Button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-ghost w-full justify-start text-error hover:bg-error/10 hover:text-error"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Button to="/register" fullWidth onClick={() => setOpen(false)}>
                  Create your profile
                </Button>
                <Button to="/login" variant="secondary" fullWidth onClick={() => setOpen(false)}>
                  Sign in
                </Button>
                <Link
                  to="/search"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-bg-secondary"
                >
                  <Search className="h-4 w-4" aria-hidden="true" /> Browse sample profiles
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}
