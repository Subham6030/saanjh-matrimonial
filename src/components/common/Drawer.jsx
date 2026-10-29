import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../utils/cn'

export default function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  width = 'max-w-md',
  footer,
  hideHeader = false,
  bodyClassName,
}) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    const timer = setTimeout(() => {
      const target = closeRef.current || panelRef.current
      target?.focus()
    }, 40)
    function onKeyDown(event) {
      if (event.key === 'Escape') onCloseRef.current?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[95]">
      <div
        className="absolute inset-0 bg-ink-primary/45 backdrop-blur-[2px] animate-fade-in"
        onClick={() => onCloseRef.current?.()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Navigation drawer'}
        tabIndex={-1}
        className={cn(
          'absolute inset-y-0 flex w-[88%] flex-col border-line bg-bg-card shadow-lift focus:outline-none',
          width,
          side === 'right'
            ? 'right-0 border-l animate-slide-in-right'
            : 'left-0 border-r animate-slide-in-left',
        )}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="font-display text-xl text-ink-primary">{title}</div>
            <button ref={closeRef} type="button" onClick={onClose} className="btn-icon" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className={bodyClassName || 'flex-1 overflow-y-auto px-4 py-5'}>{children}</div>
        {footer && <div className="border-t border-line p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
