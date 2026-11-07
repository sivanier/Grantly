import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import {
  ApplicationTrackerPage,
  DashboardPage,
  ExploreScholarshipsPage,
  HelpPage,
  NotificationsPage,
  ProfilePage,
  SavedScholarshipsPage,
  ScholarshipDetailsPage,
  SettingsPage,
  SmartMatchPage,
} from './pages/index.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ROUTES } from './utils/constants.js'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.explore} element={<ExploreScholarshipsPage />} />
        <Route path={ROUTES.scholarshipDetails} element={<ScholarshipDetailsPage />} />
        <Route path={ROUTES.smartMatch} element={<SmartMatchPage />} />
        <Route path={ROUTES.tracker} element={<ApplicationTrackerPage />} />
        <Route path={ROUTES.saved} element={<SavedScholarshipsPage />} />
        <Route path={ROUTES.notifications} element={<NotificationsPage />} />
        <Route path={ROUTES.profile} element={<ProfilePage />} />
        <Route path={ROUTES.settings} element={<SettingsPage />} />
        <Route path={ROUTES.help} element={<HelpPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
