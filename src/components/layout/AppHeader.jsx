import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { ROUTES } from '../../utils/constants.js'
import Avatar from '../ui/Avatar.jsx'
import Dropdown from '../ui/Dropdown.jsx'
import IconButton from '../ui/IconButton.jsx'
import SearchInput from '../ui/SearchInput.jsx'
import useStudentDisplayName from '../../hooks/useStudentDisplayName.js'
import useNotifications from '../../hooks/useNotifications.js'

const TITLES = {
  [ROUTES.dashboard]: 'Dashboard', [ROUTES.explore]: 'Explore scholarships', [ROUTES.smartMatch]: 'Smart match',
  [ROUTES.tracker]: 'Application tracker', [ROUTES.saved]: 'Saved scholarships', [ROUTES.notifications]: 'Notifications',
  [ROUTES.profile]: 'Profile', [ROUTES.settings]: 'Settings', [ROUTES.help]: 'Help & support',
}

export default function AppHeader({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const studentName = useStudentDisplayName()
  const { notifications, unreadCount, markRead } = useNotifications()
  const recentNotifications = notifications.slice(0, 3)
  const title = location.pathname.startsWith('/scholarships/') ? 'Scholarship details' : (TITLES[location.pathname] || 'GRANTLY')
  const searchScholarships = (value) => {
    navigate(`${ROUTES.explore}?q=${encodeURIComponent(value.trim())}`)
    setMobileSearchOpen(false)
  }
  return <header className="app-header">
    <div className="header-leading">
      <IconButton className="mobile-menu-button" icon={Menu} label="Open navigation" onClick={onMenuClick} />
      <div className="header-page-title"><span className="header-eyebrow">Your funding journey</span><h1>{title}</h1></div>
    </div>
    <div className="header-actions">
      <IconButton className="mobile-search-button" icon={Search} label="Search scholarships" onClick={() => setMobileSearchOpen(!mobileSearchOpen)} />
      <SearchInput className={`header-search${mobileSearchOpen ? ' is-open' : ''}`} placeholder="Search scholarships..." aria-label="Search scholarships" onSubmit={searchScholarships} autoFocus={mobileSearchOpen} />
      <div className="popover-anchor">
        <IconButton icon={Bell} label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false) }} className="notification-button" aria-expanded={notificationsOpen} aria-haspopup="dialog">
          {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
        </IconButton>
        <Dropdown open={notificationsOpen} onClose={() => setNotificationsOpen(false)} className="notification-popover" aria-labelledby="header-notifications-title">
          <div className="popover-heading"><strong id="header-notifications-title">Notifications</strong><span className={`badge ${unreadCount ? 'badge-indigo' : 'badge-neutral'}`}>{unreadCount} unread</span></div>
          {recentNotifications.length ? <div className="header-notification-list">{recentNotifications.map((item) => <Link key={item.id} className={`header-notification-link${item.read ? '' : ' is-unread'}`} to={item.destination === 'tracker' ? ROUTES.tracker : ROUTES.scholarshipDetails.replace(':scholarshipId', item.scholarshipId)} onClick={() => { markRead(item.id); setNotificationsOpen(false) }}><span className="header-notification-copy"><strong>{item.title}</strong><small>{item.scholarshipName || item.dateLabel}</small></span>{!item.read && <span className="header-notification-dot" aria-label="Unread" />}</Link>)}</div> : <p className="popover-message">You’re all caught up. Local reminders and tracker updates will appear here.</p>}
          <button className="text-action" onClick={() => { setNotificationsOpen(false); navigate(ROUTES.notifications) }}>View all notifications</button>
        </Dropdown>
      </div>
      <div className="popover-anchor profile-anchor">
        <button className="profile-trigger" aria-expanded={profileOpen} aria-haspopup="menu" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false) }}>
          <Avatar name={studentName} size="sm" /><span className="profile-trigger-copy"><strong>{studentName}</strong><small>Student</small></span><ChevronDown size={16} aria-hidden="true" />
        </button>
        <Dropdown open={profileOpen} onClose={() => setProfileOpen(false)} role="menu" className="profile-popover">
          <button role="menuitem" className="dropdown-item" onClick={() => { setProfileOpen(false); navigate(ROUTES.profile) }}>View profile</button>
          <button role="menuitem" className="dropdown-item" onClick={() => { setProfileOpen(false); navigate(ROUTES.settings) }}>Settings</button>
        </Dropdown>
      </div>
    </div>
  </header>
}
