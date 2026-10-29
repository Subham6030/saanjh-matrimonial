export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_PATTERN = /^[+]?[\d\s()-]{10,16}$/

export function isRequired(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'number') return !Number.isNaN(value)
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value)
}

export function validateEmail(value) {
  if (!isRequired(value)) return 'Email is required.'
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address.'
  return ''
}

export function validatePhone(value) {
  if (!isRequired(value)) return 'Phone number is required.'
  const digits = value.replace(/\D/g, '')
  if (!PHONE_PATTERN.test(value.trim()) || digits.length < 10)
    return 'Enter a valid phone number with at least 10 digits.'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Use at least 8 characters.'
  return ''
}

export function passwordStrength(value = '') {
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  }
  const score = Object.values(checks).filter(Boolean).length
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  return {
    score,
    label: labels[score],
    checks,
    percent: (score / 5) * 100,
  }
}

export function validateDob(value, minimumAge = 18) {
  if (!value) return 'Date of birth is required.'
  const dob = new Date(value)
  if (Number.isNaN(dob.getTime())) return 'Enter a valid date of birth.'
  if (dob > new Date()) return 'Date of birth cannot be in the future.'
  const age = new Date().getFullYear() - dob.getFullYear()
  const monthDiff = new Date().getMonth() - dob.getMonth()
  const dayDiff = new Date().getDate() - dob.getDate()
  const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
  if (exactAge < minimumAge) return `You must be at least ${minimumAge} years old to register.`
  if (exactAge > 80) return 'Please enter a valid date of birth.'
  return ''
}

export function validateUrl(value) {
  if (!value) return ''
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? '' : 'Enter a valid URL.'
  } catch {
    return 'Enter a valid URL.'
  }
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}
