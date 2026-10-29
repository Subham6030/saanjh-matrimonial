import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import { AdminGate, RequireAuth } from './components/layout/RouteGuards'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateProfile from './pages/CreateProfile'
import EditProfile from './pages/EditProfile'
import PartnerPreferences from './pages/PartnerPreferences'
import Dashboard from './pages/Dashboard'
import DiscoverMatches from './pages/DiscoverMatches'
import SearchProfiles from './pages/SearchProfiles'
import ProfileDetails from './pages/ProfileDetails'
import ShortlistedProfiles from './pages/ShortlistedProfiles'
import Interests from './pages/Interests'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import SubscriptionPlans from './pages/SubscriptionPlans'
import CheckoutDemo from './pages/CheckoutDemo'
import AccountSettings from './pages/AccountSettings'
import InfoPage from './pages/InfoPage'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/AdminDashboard'
import ManageProfiles from './pages/ManageProfiles'
import ManageSubscriptions from './pages/ManageSubscriptions'
import Reports from './pages/Reports'
import AdminSettings from './pages/AdminSettings'

function ScrollManager() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo(0, 0)
      }, 60)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo(0, 0)
    return undefined
  }, [pathname, search, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<InfoPage page="about" />} />
          <Route path="contact" element={<InfoPage page="contact" />} />
          <Route path="privacy" element={<InfoPage page="privacy" />} />
          <Route path="terms" element={<InfoPage page="terms" />} />
          <Route path="help" element={<InfoPage page="help" />} />
          <Route path="profile/:id" element={<ProfileDetails />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="matches" element={<DiscoverMatches />} />
            <Route path="search" element={<SearchProfiles />} />
            <Route path="shortlist" element={<ShortlistedProfiles />} />
            <Route path="interests" element={<Interests />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="plans" element={<SubscriptionPlans />} />
            <Route path="checkout" element={<CheckoutDemo />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="create-profile" element={<CreateProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="preferences" element={<PartnerPreferences />} />
            <Route path="partner-preferences" element={<Navigate to="/preferences" replace />} />
            <Route path="membership" element={<Navigate to="/plans" replace />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="profile/me" element={<ProfileDetails />} />
          </Route>
        </Route>

        <Route element={<AdminGate />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profiles" element={<ManageProfiles />} />
            <Route path="subscriptions" element={<ManageSubscriptions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
