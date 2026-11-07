import { Bell, Bookmark, Compass, FileCheck2, LayoutDashboard, LifeBuoy, Settings, Sparkles, UserRound } from 'lucide-react'

export const APP_NAME = 'GRANTLY'
export const APP_TAGLINE = 'Your Future Deserves Funding.'
export const SAVED_SCHOLARSHIPS_UPDATED_EVENT = 'grantly:saved-scholarships-updated'

export const STORAGE_KEYS = {
  profile: 'grantly:profile',
  savedScholarshipIds: 'grantly:savedScholarshipIds',
  notificationState: 'grantly:notificationState',
}

export const ROUTES = {
  dashboard: '/',
  explore: '/scholarships',
  scholarshipDetails: '/scholarships/:scholarshipId',
  smartMatch: '/smart-match',
  tracker: '/applications',
  saved: '/saved',
  notifications: '/notifications',
  profile: '/profile',
  settings: '/settings',
  help: '/help',
}

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Explore scholarships', path: ROUTES.explore, icon: Compass },
  { label: 'Smart match', path: ROUTES.smartMatch, icon: Sparkles },
  { label: 'Application tracker', path: ROUTES.tracker, icon: FileCheck2 },
  { label: 'Saved scholarships', path: ROUTES.saved, icon: Bookmark },
  { label: 'Notifications', path: ROUTES.notifications, icon: Bell },
  { label: 'Profile', path: ROUTES.profile, icon: UserRound },
  { label: 'Settings', path: ROUTES.settings, icon: Settings },
]

export const SUPPORT_ITEM = { label: 'Help & support', path: ROUTES.help, icon: LifeBuoy }
