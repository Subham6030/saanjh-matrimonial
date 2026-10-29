import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { TriangleAlert, X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../utils/cn'
import Button from './Button'

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  bodyClassName,
}) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()
  onCloseRef.current = onClose
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    const timer = setTimeout(() => {
      closeRef.current?.focus()
    }, 30)

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink-primary/45 backdrop-blur-[2px] animate-fade-in"
        onClick={() => onCloseRef.current?.()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-line bg-bg-card shadow-lift animate-scale-in sm:max-h-[90vh] sm:rounded-2xl',
          sizes[size] || sizes.md,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-ink-primary sm:text-xl">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm leading-6 text-ink-secondary">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current?.()}
            className="btn-icon -mr-2 -mt-1"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={cn('flex-1 overflow-y-auto px-5 py-5 sm:px-6', bodyClassName)}>{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-line bg-bg-elevated/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  children,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            tone === 'danger' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning',
          )}
        >
          <TriangleAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="text-sm leading-6 text-ink-secondary">
          {children || 'This action will update the simulated demo data in your browser.'}
        </div>
      </div>
    </Modal>
  )
}
