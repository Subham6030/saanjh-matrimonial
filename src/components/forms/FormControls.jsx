import { Children, Fragment, isValidElement, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Eye, EyeOff, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { passwordStrength } from '../../utils/validation'

export function Field({ label, htmlFor, error, hint, required, className, children }) {
  return (
    <div className={cn('min-w-0', className)}>
      {label && (
        <label htmlFor={htmlFor} className="label-base">
          {label}
          {required && (
            <span className="ml-0.5 text-brand" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1.5 text-xs font-medium text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="mt-1.5 text-xs leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ invalid, className, id, error, hint, ...props }) {
  const describedBy =
    [error && id ? `${id}-error` : null, hint && id ? `${id}-hint` : null].filter(Boolean).join(' ') ||
    undefined
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn('field-base', invalid && 'field-error', className)}
      {...props}
    />
  )
}

function flattenOptionText(children) {
  if (children === null || children === undefined || typeof children === 'boolean') return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(flattenOptionText).join('')
  return ''
}

function collectOptions(children, list = []) {
  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return
    if (Array.isArray(child)) {
      collectOptions(child, list)
      return
    }
    if (!isValidElement(child)) return
    if (child.type === Fragment) {
      collectOptions(child.props.children, list)
      return
    }
    if (child.type !== 'option') return
    const text = flattenOptionText(child.props.children)
    list.push({
      value: child.props.value === undefined || child.props.value === null ? text : String(child.props.value),
      label: text,
      disabled: Boolean(child.props.disabled),
    })
  })
  return list
}

export function Select({
  invalid,
  className,
  id,
  error,
  hint,
  disabled,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  children,
  ...props
}) {
  const describedBy =
    [error && id ? `${id}-error` : null, hint && id ? `${id}-hint` : null].filter(Boolean).join(' ') ||
    undefined
  const listboxId = useId()
  const options = collectOptions(children)
  const selectedValue = value === undefined || value === null ? '' : String(value)
  const selectedIndex = options.findIndex((option) => option.value === selectedValue)

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [pos, setPos] = useState(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)

  function updatePosition() {
    const trigger = triggerRef.current
    if (!trigger) {
      setOpen(false)
      return
    }
    const rect = trigger.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      setOpen(false)
      return
    }
    const below = window.innerHeight - rect.bottom
    const above = rect.top
    const openAbove = below < 220 && above > below
    const maxHeight = Math.max(120, Math.min(280, (openAbove ? above : below) - 16))
    const width = Math.max(rect.width, 170)
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
    setPos({
      left,
      width,
      maxHeight,
      ...(openAbove ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    })
  }

  useEffect(() => {
    if (!open) return undefined
    updatePosition()
    function onScrollOrResize() {
      updatePosition()
    }
    function onPointerDown(event) {
      if (triggerRef.current?.contains(event.target)) return
      if (listRef.current?.contains(event.target)) return
      setOpen(false)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  function openList() {
    if (disabled) return
    updatePosition()
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : options.findIndex((option) => !option.disabled))
    setOpen(true)
  }

  function toggle() {
    if (open) setOpen(false)
    else openList()
  }

  function selectOption(index) {
    const option = options[index]
    if (!option || option.disabled) return
    onChange?.({ target: { value: option.value, name, id }, type: 'change' })
    setOpen(false)
    triggerRef.current?.focus()
  }

  function moveActive(delta) {
    setActiveIndex((current) => {
      const count = options.length
      if (!count) return current
      let next = current
      for (let step = 0; step < count; step += 1) {
        next = (next + delta + count) % count
        if (!options[next].disabled) return next
      }
      return current
    })
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) openList()
      else moveActive(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openList()
      else moveActive(-1)
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      setActiveIndex(options.findIndex((option) => !option.disabled))
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      for (let index = options.length - 1; index >= 0; index -= 1) {
        if (!options[index].disabled) {
          setActiveIndex(index)
          break
        }
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      selectOption(activeIndex)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Tab' && open) {
      setOpen(false)
    }
  }

  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : ''

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        className={cn(
          'field-base relative flex w-full cursor-pointer items-center justify-between gap-2 pr-9 text-left',
          invalid && 'field-error',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        {...props}
      >
        <span className={cn('truncate', !selectedLabel && !selectedValue && 'text-ink-muted')}>
          {selectedLabel || selectedValue}
        </span>
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            style={{
              position: 'fixed',
              left: pos.left,
              top: pos.top,
              bottom: pos.bottom,
              width: pos.width,
              maxHeight: pos.maxHeight,
            }}
            className="z-[120] overflow-y-auto overscroll-contain rounded-xl border border-line bg-bg-elevated py-1 shadow-lift"
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-muted">No options</li>
            )}
            {options.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                id={`${listboxId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={index === selectedIndex}
                aria-disabled={option.disabled || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(index)}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index)
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm',
                  index === activeIndex && 'bg-bg-secondary',
                  option.disabled && 'cursor-not-allowed opacity-50',
                  index === selectedIndex ? 'font-semibold text-brand' : 'text-ink-primary',
                )}
              >
                <span className="truncate">{option.label}</span>
                {index === selectedIndex && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  )
}

export function Textarea({ invalid, className, id, error, hint, ...props }) {
  const describedBy =
    [error && id ? `${id}-error` : null, hint && id ? `${id}-hint` : null].filter(Boolean).join(' ') ||
    undefined
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn('field-base min-h-[110px] resize-y leading-6', invalid && 'field-error', className)}
      {...props}
    />
  )
}

export function TextField({ label, error, hint, required, className, inputClassName, id, ...props }) {
  const autoId = useId()
  const fieldId = id || autoId
  return (
    <Field label={label} htmlFor={fieldId} error={error} hint={hint} required={required} className={className}>
      <Input id={fieldId} error={error} hint={hint} invalid={Boolean(error)} className={inputClassName} {...props} />
    </Field>
  )
}

export function SelectField({
  label,
  error,
  hint,
  required,
  className,
  selectClassName,
  id,
  children,
  placeholder,
  ...props
}) {
  const autoId = useId()
  const fieldId = id || autoId
  return (
    <Field label={label} htmlFor={fieldId} error={error} hint={hint} required={required} className={className}>
      <Select
        id={fieldId}
        error={error}
        hint={hint}
        invalid={Boolean(error)}
        className={selectClassName}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </Select>
    </Field>
  )
}

export function TextareaField({
  label,
  error,
  hint,
  required,
  className,
  textareaClassName,
  id,
  ...props
}) {
  const autoId = useId()
  const fieldId = id || autoId
  return (
    <Field label={label} htmlFor={fieldId} error={error} hint={hint} required={required} className={className}>
      <Textarea
        id={fieldId}
        error={error}
        hint={hint}
        invalid={Boolean(error)}
        className={textareaClassName}
        {...props}
      />
    </Field>
  )
}

export function PasswordField({
  label = 'Password',
  error,
  hint,
  required,
  showStrength = false,
  value = '',
  className,
  id,
  type = 'password',
  visible = false,
  onToggleVisibility,
  ...props
}) {
  const autoId = useId()
  const fieldId = id || autoId
  const strength = passwordStrength(value)

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={!showStrength ? hint : undefined}
      required={required}
      className={className}
    >
      <div className="relative">
        <Input
          id={fieldId}
          type={type}
          value={value}
          error={error}
          invalid={Boolean(error)}
          className="pr-11"
          {...props}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-muted transition-colors hover:text-ink-primary"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && (
        <div className="mt-2">
          <div className="flex gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  strength.score >= step
                    ? strength.score >= 4
                      ? 'bg-success'
                      : strength.score >= 3
                        ? 'bg-warning'
                        : 'bg-error'
                    : 'bg-bg-secondary',
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink-muted">
            Password strength: <span className="font-semibold text-ink-secondary">{strength.label}</span>
          </p>
          <ul className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-ink-muted sm:grid-cols-2">
            {[
              ['8+ characters', strength.checks.length],
              ['Uppercase letter', strength.checks.upper],
              ['Lowercase letter', strength.checks.lower],
              ['Number', strength.checks.number],
              ['Symbol', strength.checks.symbol],
            ].map(([text, met]) => (
              <li key={text} className={cn('flex items-center gap-1.5', met && 'text-success')}>
                {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hint && showStrength && <p className="mt-2 text-xs leading-5 text-ink-muted">{hint}</p>}
    </Field>
  )
}

export function Checkbox({ label, description, error, className, id, ...props }) {
  const autoId = useId()
  const checkboxId = id || autoId
  return (
    <div className={className}>
      <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-2.5">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={checkboxId}
            type="checkbox"
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-line bg-bg-elevated transition-colors checked:border-brand checked:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
            aria-invalid={Boolean(error) || undefined}
            {...props}
          />
          <Check
            className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span>
          <span className="block text-sm font-medium text-ink-primary">
            {label}
            {props.required && <span className="ml-0.5 text-brand">*</span>}
          </span>
          {description && <span className="mt-0.5 block text-xs leading-5 text-ink-muted">{description}</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description, className, disabled }) {
  const id = useId()
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-semibold text-ink-primary">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-5 text-ink-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
          checked ? 'bg-brand' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

export function OptionChips({
  options,
  value,
  onChange,
  multiple = true,
  columns = false,
  className,
  ariaLabel,
}) {
  const selected = multiple ? (Array.isArray(value) ? value : []) : value
  const isSelected = (item) => (multiple ? selected.includes(item) : selected === item)

  function toggle(item) {
    if (!multiple) {
      onChange(item)
      return
    }
    onChange(selected.includes(item) ? selected.filter((entry) => entry !== item) : [...selected, item])
  }

  return (
    <div
      className={cn('flex flex-wrap gap-2', columns && 'grid grid-cols-2 gap-2 sm:grid-cols-3', className)}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const item = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label
        const active = isSelected(item)
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(item)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-bg-card text-ink-secondary hover:border-brand/40 hover:text-brand',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function FormSection({ title, description, children, className, actions }) {
  return (
    <section className={cn('card-surface p-5 sm:p-6', className)}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-ink-secondary">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}
