import { useMemo } from 'react'
import { CalendarDays, ChevronRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DEMO_DEADLINES } from '../../data/scholarships.js'
import { ROUTES } from '../../utils/constants.js'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

function getDaysRemaining(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const deadline = new Date(year, month - 1, day)
  deadline.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((deadline - today) / 86400000)
}

function DeadlineRow({ item }) {
  const days = getDaysRemaining(item.deadline)
  const urgency = days <= 7 ? 'urgent' : days <= 21 ? 'approaching' : 'upcoming'
  const urgencyLabel = days < 0 ? 'Past demo date' : days === 0 ? 'Due today' : `${days} days left`
  return <li className="deadline-row">
    <span className={`deadline-icon deadline-icon-${urgency}`}><CalendarDays size={17} aria-hidden="true" /></span>
    <span className="deadline-copy"><strong>{item.name}</strong><small>Demo date · {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${item.deadline}T12:00:00`))}</small></span>
    <Badge tone={urgency === 'urgent' ? 'warning' : urgency === 'approaching' ? 'indigo' : 'emerald'} className={`deadline-badge deadline-${urgency}`}><Clock3 size={11} aria-hidden="true" />{urgencyLabel}</Badge>
  </li>
}

export default function DeadlineWidget() {
  const deadlines = useMemo(() => [...DEMO_DEADLINES].sort((a, b) => a.deadline.localeCompare(b.deadline)), [])
  return <Card className="dashboard-panel deadline-panel">
    <SectionHeading title="Upcoming deadlines" description="Fictional scholarship dates · earliest first" action={<Link aria-label="View all scholarship deadlines" className="panel-icon-link" to={ROUTES.tracker}><ChevronRight size={17} /></Link>} />
    {deadlines.length ? <ul className="deadline-list">{deadlines.map((item) => <DeadlineRow key={item.id} item={item} />)}</ul> : <EmptyState icon={CalendarDays} title="No upcoming deadlines" description="New demo scholarship dates will appear here." />}
  </Card>
}
