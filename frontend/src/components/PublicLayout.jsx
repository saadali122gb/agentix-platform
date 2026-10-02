import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PublicNav from './PublicNav'
import PublicFooter from './PublicFooter'

export default function PublicLayout() {
  const { pathname } = useLocation()
  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas text-content">
      <PublicNav />
      <Outlet />
      <PublicFooter />
    </div>
  )
}
