import { Bookmark, CalendarClock, FileCheck2, Sparkles } from 'lucide-react'
import { DEMO_STATISTICS } from '../../data/scholarships.js'
import StatCard from '../ui/StatCard.jsx'

const ICONS = { match: Sparkles, saved: Bookmark, submitted: FileCheck2, deadline: CalendarClock }

export default function DashboardStatGrid() {
  return <section className="dashboard-stat-grid" aria-label="Funding overview sample metrics">
    {DEMO_STATISTICS.map((stat) => <StatCard key={stat.iconName} {...stat} icon={ICONS[stat.iconName]} />)}
  </section>
}
