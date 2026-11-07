import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader.jsx'
import AppSidebar from './AppSidebar.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <AppSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
    <div className="app-main">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <main className="main-content" id="main-content"><Outlet /></main>
    </div>
  </div>
}
