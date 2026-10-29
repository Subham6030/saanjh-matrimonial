import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext(null)
const THEME_KEY = 'saanjh.theme.mode'

function systemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage(THEME_KEY, 'system')
  const [systemPreference, setSystemPreference] = useState(systemTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event) => setSystemPreference(event.matches ? 'dark' : 'light')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const resolvedTheme = mode === 'system' ? systemPreference : mode

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolvedTheme)
    root.classList.toggle('dark', resolvedTheme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolvedTheme === 'dark' ? '#15181E' : '#F4F5F8')
  }, [resolvedTheme])

  const toggleTheme = useCallback(
    () => setMode(resolvedTheme === 'dark' ? 'light' : 'dark'),
    [resolvedTheme, setMode],
  )

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setTheme: setMode,
      toggleTheme,
    }),
    [mode, resolvedTheme, setMode, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
