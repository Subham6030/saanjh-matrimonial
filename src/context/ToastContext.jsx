import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../utils/cn'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const tones = {
  success: 'border-success/30 bg-bg-elevated text-ink-primary',
  error: 'border-error/35 bg-bg-elevated text-ink-primary',
  info: 'border-line bg-bg-elevated text-ink-primary',
}

const iconTones = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-brand',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (type, message, options = {}) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`
      const toast = {
        id,
        type,
        message,
        title: options.title,
        duration: options.duration ?? 4200,
      }
      setToasts((items) => [...items.slice(-3), toast])
      if (toast.duration > 0) {
        const timer = setTimeout(() => dismiss(id), toast.duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (message, options) => push('success', message, options),
      error: (message, options) => push('error', message, options),
      info: (message, options) => push('info', message, options),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((item) => {
          const Icon = icons[item.type] || Info
          return (
            <div
              key={item.id}
              role={item.type === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lift animate-toast-in',
                tones[item.type] || tones.info,
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconTones[item.type])} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {item.title && <p className="mb-0.5 text-sm font-semibold">{item.title}</p>}
                <p className="text-sm leading-6 text-ink-secondary">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-bg-secondary hover:text-ink-primary"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
