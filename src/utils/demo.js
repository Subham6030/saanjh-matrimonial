import { clearDemoStorage } from './storage'

export const DEMO_NOTICE =
  'This is a front-end demonstration. All profiles, conversations, statistics and payments are simulated sample data.'

export const DEMO_ACCOUNTS = {
  member: {
    name: 'Aanya Verma',
    email: 'demo@saanjh.example',
    passwordHint: 'demo1234',
    role: 'member',
  },
  admin: {
    name: 'Saanjh Admin',
    email: 'admin@saanjh.example',
    passwordHint: 'admin1234',
    role: 'admin',
  },
}

export function resetDemoData() {
  clearDemoStorage()
  try {
    window.sessionStorage.clear()
  } catch {
    /* no-op */
  }
  window.location.assign('/')
}
