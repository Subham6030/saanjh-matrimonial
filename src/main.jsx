import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import { ProfileProvider } from './context/ProfileContext'
import { NotificationProvider } from './context/NotificationContext'
import { MatchProvider } from './context/MatchContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { MessagingProvider } from './context/MessagingContext'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AdminProvider>
              <ProfileProvider>
                <NotificationProvider>
                  <MatchProvider>
                    <SubscriptionProvider>
                      <MessagingProvider>
                        <App />
                      </MessagingProvider>
                    </SubscriptionProvider>
                  </MatchProvider>
                </NotificationProvider>
              </ProfileProvider>
            </AdminProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
