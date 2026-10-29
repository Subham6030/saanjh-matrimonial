import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import { cn } from '../../utils/cn'

export default function NotificationBell({ className }) {
  const { unreadCount } = useNotifications()
  return (
    <Link
      to="/notifications"
      className={cn('btn-icon relative border border-transparent', className)}
      aria-label={
        unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications, no unread items'
      }
      title="Notifications"
    >
      <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white ring-2 ring-bg-primary">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
