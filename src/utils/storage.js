export const STORAGE_PREFIX = 'saanjh.'

export function resolveValue(value) {
  return typeof value === 'function' ? value() : value
}

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return resolveValue(fallback)
    return JSON.parse(raw)
  } catch {
    return resolveValue(fallback)
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Unable to persist ${key}`, error)
    return false
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* no-op */
  }
}

export function clearDemoStorage() {
  try {
    const keys = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key)
    }
    keys.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    /* no-op */
  }
}
