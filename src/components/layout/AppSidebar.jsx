import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, X } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, NAVIGATION_ITEMS, ROUTES, SUPPORT_ITEM } from '../../utils/constants.js'
import Avatar from '../ui/Avatar.jsx'
import useStudentDisplayName from '../../hooks/useStudentDisplayName.js'
import useNotifications from '../../hooks/useNotifications.js'

export default function AppSidebar({ open, onNavigate, onClose }) {
  const studentName = useStudentDisplayName()
  const { unreadCount } = useNotifications()
  return <>
    <button className={`sidebar-backdrop ${open ? 'is-visible' : ''}`} aria-label="Close navigation" onClick={onClose} tabIndex={open ? 0 : -1} />
    <aside className={`app-sidebar ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-brand-row">
        <Link to={ROUTES.dashboard} className="brand-lockup" onClick={onNavigate} aria-label={`${APP_NAME} dashboard`}>
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-copy"><strong>{APP_NAME}</strong><small>{APP_TAGLINE}</small></span>
        </Link>
        <button className="sidebar-close icon-button" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>
      </div>
      <p className="nav-caption">Workspace</p>
      <nav className="primary-nav" aria-label="Workspace">
        {NAVIGATION_ITEMS.slice(0, 6).map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onNavigate} end={path === ROUTES.dashboard} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>{path === ROUTES.notifications && unreadCount > 0 && <span className="nav-unread" aria-label={`${unreadCount} unread notifications`} />}
        </NavLink>)}
      </nav>
      <p className="nav-caption nav-caption-account">Account</p>
      <nav className="primary-nav" aria-label="Account">
        {NAVIGATION_ITEMS.slice(6).map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onNavigate} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}>
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
        </NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to={SUPPORT_ITEM.path} onClick={onNavigate} className={({ isActive }) => `nav-link support-link${isActive ? ' is-active' : ''}`}>
          <SUPPORT_ITEM.icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{SUPPORT_ITEM.label}</span><ArrowUpRight size={15} className="support-arrow" aria-hidden="true" />
        </NavLink>
        <Link to={ROUTES.profile} onClick={onNavigate} className="sidebar-user">
          <Avatar name={studentName} size="md" /><span className="sidebar-user-copy"><strong>{studentName}</strong><small>Student account</small></span><span className="user-menu-dots" aria-hidden="true">···</span>
        </Link>
      </div>
    </aside>
  </>
}
