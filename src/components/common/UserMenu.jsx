import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useClickOutside } from '../../hooks/useClickOutside'
import { demoMemberProfile } from '../../data/member'
import { cn } from '../../utils/cn'
import { Avatar } from './ui'

export default function UserMenu({ className }) {
  const { user, isAdmin, logout } = useAuth()
  const toastApi = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false), open)

  if (!user) return null
  const photo = user.id === 'demo-member' ? demoMemberProfile.primaryPhoto : null

  function handleSignOut() {
    logout()
    setOpen(false)
    toastApi.info('You have signed out of the demo session.')
    navigate('/')
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-line bg-bg-card py-1 pl-1 pr-2.5 transition-colors hover:border-brand/40"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <Avatar src={photo} name={user.name} size="xs" />
        <span className="hidden max-w-[110px] truncate text-xs font-semibold text-ink-secondary sm:block">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-ink-muted transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-bg-card shadow-lift animate-scale-in"
        >
          <div className="border-b border-line bg-bg-elevated/60 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink-primary">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
              {isAdmin ? 'Demo admin' : 'Simulated member'}
            </span>
          </div>
          <div className="p-1.5">
            {isAdmin ? (
              <MenuLink to="/admin" icon={ShieldCheck} onClick={() => setOpen(false)}>
                Admin dashboard
              </MenuLink>
            ) : (
              <>
                <MenuLink to="/dashboard" icon={LayoutDashboard} onClick={() => setOpen(false)}>
                  Dashboard
                </MenuLink>
                <MenuLink to="/profile/edit" icon={UserRound} onClick={() => setOpen(false)}>
                  Edit profile
                </MenuLink>
                <MenuLink
                  to="/partner-preferences"
                  icon={SlidersHorizontal}
                  onClick={() => setOpen(false)}
                >
                  Partner preferences
                </MenuLink>
              </>
            )}
            <MenuLink to="/settings" icon={Settings} onClick={() => setOpen(false)}>
              Account settings
            </MenuLink>
            <div className="my-1 h-px bg-line" />
            <button
              type="button"
              onClick={handleSignOut}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-error transition-colors hover:bg-error/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-bg-secondary hover:text-ink-primary"
    >
      <Icon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
      {children}
    </Link>
  )
}
