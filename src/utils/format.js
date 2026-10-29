export function formatDate(value, options = {}) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value) {
  return formatDate(value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function relativeTime(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const diff = date.getTime() - Date.now()
  const abs = Math.abs(diff)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (abs < 60 * 1000) return 'Just now'
  if (abs < 60 * 60 * 1000) return formatter.format(Math.round(diff / (60 * 1000)), 'minute')
  if (abs < 24 * 60 * 60 * 1000) return formatter.format(Math.round(diff / (60 * 60 * 1000)), 'hour')
  if (abs < 7 * 24 * 60 * 60 * 1000)
    return formatter.format(Math.round(diff / (24 * 60 * 60 * 1000)), 'day')
  return formatDate(date, { year: undefined })
}

export function formatCurrency(amount, currency = 'INR') {
  const numeric = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function firstName(name = '') {
  return name.trim().split(' ')[0] || name
}

export function heightLabel(cm) {
  if (!cm) return '—'
  const totalInches = Math.round(Number(cm) / 2.54)
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return `${feet}' ${inches}" · ${cm} cm`
}

export function truncate(text = '', length = 120) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trimEnd()}…`
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function calculateAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1
  return age
}

export function yearsFromNow(years) {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return date.toISOString()
}

export function addMonths(months, from = new Date()) {
  const date = new Date(from)
  date.setMonth(date.getMonth() + months)
  return date.toISOString()
}
