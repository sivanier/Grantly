import PagePlaceholder from '../components/ui/PagePlaceholder.jsx'
import { Bookmark, Settings, LifeBuoy } from 'lucide-react'
export { default as DashboardPage } from './DashboardPage.jsx'
export { default as ExploreScholarshipsPage } from './ExploreScholarshipsPage.jsx'
export { default as ScholarshipDetailsPage } from './ScholarshipDetailsPage.jsx'
export { default as SmartMatchPage } from './SmartMatchPage.jsx'
export { default as ApplicationTrackerPage } from './ApplicationTrackerPage.jsx'
export { default as ProfilePage } from './ProfilePage.jsx'
export { default as SavedScholarshipsPage } from './SavedScholarshipsPage.jsx'
export { default as NotificationsPage } from './NotificationsPage.jsx'
export function SettingsPage() {
  return <PagePlaceholder eyebrow="Preferences" icon={Settings} title="Settings" description="Choose how you want GRANTLY to work for you." emptyTitle="Your preferences, all in one place" emptyDescription="Account and notification preferences will be available here." />
}
export function HelpPage() {
  return <PagePlaceholder eyebrow="We’re here to help" icon={LifeBuoy} title="Help & support" description="Find guidance for making the most of your scholarship search." emptyTitle="How can we help?" emptyDescription="Helpful answers and support resources will be collected here." />
}
