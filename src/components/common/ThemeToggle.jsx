import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'

export default function ThemeToggle({ className, showLabel = false }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line bg-bg-card p-2 text-ink-secondary transition-colors hover:border-brand/40 hover:text-brand',
        showLabel && 'px-3',
        className,
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      {showLabel && <span className="text-xs font-semibold">{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  )
}
