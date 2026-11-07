import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Bell, BellRing, CalendarClock, Check, CircleCheck, FileCheck2, Trash2 } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import useNotifications from '../hooks/useNotifications.js'
import { ROUTES } from '../utils/constants.js'

const TYPE_META = {
  deadline: { icon: CalendarClock, label: 'Deadline' },
  reminder: { icon: BellRing, label: 'Local reminder' },
  application: { icon: FileCheck2, label: 'Application tracker' },
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, dismissedCount, markRead, markUnread, markAllRead, dismiss, restoreDismissed } = useNotifications()
  const openNotification = (notification) => {
    markRead(notification.id)
    navigate(notification.destination === 'tracker' ? ROUTES.tracker : ROUTES.scholarshipDetails.replace(':scholarshipId', notification.scholarshipId))
  }

  return <PageContainer className="notifications-page">
    <PageHeader eyebrow="Your updates" title="Notifications" description="A clear view of local scholarship reminders and updates from your demo tracker." action={<div className="notifications-page-actions">{dismissedCount > 0 && <Button variant="ghost" onClick={restoreDismissed}>Restore dismissed ({dismissedCount})</Button>}<Button variant="secondary" onClick={markAllRead} disabled={!unreadCount}><Check size={15} />Mark all as read</Button></div>} />
    <div className="notification-demo-notice"><AlertCircle size={16} /><p>Notifications are generated within this frontend demo using locally stored scholarship and application data. They are not official provider notifications and do not send push messages, emails, or SMS.</p></div>
    <div className="notifications-summary"><div><strong>{notifications.length}</strong><span>{notifications.length === 1 ? 'notification' : 'notifications'}</span></div><Badge tone={unreadCount ? 'indigo' : 'success'}>{unreadCount} unread</Badge></div>
    {notifications.length === 0 ? <Card className="notifications-empty-card"><EmptyState icon={Bell} title="You’re all caught up" description="Local reminders will appear here for scholarships you’ve marked, and tracker updates appear when a demo application record exists." action={<Button as={Link} to={ROUTES.explore}>Explore scholarships</Button>} /></Card> : <div className="notification-list" aria-label="Notifications">{notifications.map((item) => <NotificationCard key={item.id} item={item} onOpen={() => openNotification(item)} onRead={() => item.read ? markUnread(item.id) : markRead(item.id)} onDismiss={() => dismiss(item.id)} />)}</div>}
  </PageContainer>
}

export function NotificationCard({ item, onOpen, onRead, onDismiss, compact = false }) {
  const meta = TYPE_META[item.type] || TYPE_META.reminder
  const Icon = meta.icon
  return <article className={`notification-item${item.read ? ' is-read' : ' is-unread'}${compact ? ' is-compact' : ''}`}>
    <span className={`notification-item-icon notification-icon-${item.type}`}><Icon size={17} aria-hidden="true" /></span>
    <div className="notification-item-body"><div className="notification-item-title-row"><Badge tone={item.type === 'deadline' ? 'warning' : item.type === 'application' ? 'success' : 'indigo'}>{meta.label}</Badge>{!item.read && <span className="notification-unread-label"><span />Unread</span>}</div><button type="button" className="notification-open-button" onClick={onOpen}><strong>{item.title}</strong><span>{item.description}</span></button><p className="notification-item-date">{item.dateLabel}{item.scholarshipName && <> · <span>{item.scholarshipName}</span></>}</p></div>
    <div className="notification-item-actions"><button type="button" className="notification-text-action" onClick={onRead} aria-label={item.read ? `Mark ${item.title} unread` : `Mark ${item.title} read`}>{item.read ? <><CircleCheck size={14} />Mark unread</> : <><Check size={14} />Mark read</>}</button><button type="button" className="notification-dismiss-button" onClick={onDismiss} aria-label={`Dismiss ${item.title}`} title="Dismiss"><Trash2 size={15} /></button></div>
  </article>
}
