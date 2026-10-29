import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import PublicNavbar from '../components/layout/PublicNavbar'
import Footer from '../components/layout/Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <PublicNavbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
