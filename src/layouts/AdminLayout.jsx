import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Flag,
  Menu,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/common/Logo'
import Drawer from '../components/common/Drawer'
import ThemeToggle from '../components/common/ThemeToggle'
import UserMenu from '../components/common/UserMenu'
import { cn } from '../utils/cn'

const adminNav = [
  { label: 'Overview', to: '/admin', icon: BarChart3, end: true },
  { label: 'Profiles', to: '/admin/profiles', icon: Users },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: CreditCard },
  { label: 'Reports', to: '/admin/reports', icon: Flag, badge: true },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

const pageNames = {
  admin: 'Overview',
  profiles: 'Profile management',
  subscriptions: 'Subscription management',
  reports: 'Reports & moderation',
  settings: 'Admin settings',
}

function getPageName(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  const segment = parts[1] || 'admin'
  return pageNames[segment] || 'Admin'
}

function SidebarContent({ onNavigate }) {
  const { pendingReports } = useAdmin()
  const { user } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-5">
        <div>
          <Logo to="/admin" />
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-ultra-wide text-brand-secondary dark:bg-brand-secondary/15">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Admin console
          </p>
        </div>
        {onNavigate && (
          <button type="button" onClick={onNavigate} className="btn-icon lg:hidden" aria-label="Close admin menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-line px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-bg-secondary/60 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-primary text-bg-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-primary">{user?.name || 'Demo Admin'}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink-muted">Simulated access</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">
          Platform
        </p>
        <ul className="space-y-0.5">
          {adminNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
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
                {item.badge && pendingReports > 0 && (
                  <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {pendingReports}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-warning/25 bg-warning/10 p-3.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-warning">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Frontend-only access
          </p>
          <p className="mt-1.5 text-[11px] leading-5 text-ink-secondary">
            Role checks here are simulated. A production admin panel needs server-side
            authentication and authorisation.
          </p>
        </div>
      </nav>

      <div className="border-t border-line p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
        >
          View the public site
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout() {
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
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-ultra-wide text-ink-muted">
                Platform administration · demo
              </p>
              <p className="truncate text-sm font-semibold text-ink-primary">{getPageName(location.pathname)}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="hidden items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning sm:inline-flex">
                Demo data
              </span>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        width="max-w-[300px]"
        title="Admin navigation"
        hideHeader
        bodyClassName="flex-1 overflow-y-auto"
      >
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </div>
  )
}
