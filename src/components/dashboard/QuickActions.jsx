import { ArrowUpRight, ClipboardCheck, Compass, FileCheck2, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'
import SectionHeading from '../ui/SectionHeading.jsx'

const ACTIONS = [
  { title: 'Find scholarships', text: 'Browse opportunities', path: ROUTES.explore, icon: Compass, tone: 'indigo' },
  { title: 'Check my eligibility', text: 'Explore your fit', path: ROUTES.smartMatch, icon: ClipboardCheck, tone: 'emerald' },
  { title: 'Track applications', text: 'Review your progress', path: ROUTES.tracker, icon: FileCheck2, tone: 'warning' },
  { title: 'Complete my profile', text: 'Personalize your matches', path: ROUTES.profile, icon: UserRound, tone: 'navy' },
]

export default function QuickActions() {
  return <section className="dashboard-section" aria-label="Quick actions">
    <SectionHeading title="Your next steps" description="Shortcuts to keep your funding search moving." />
    <div className="quick-action-grid">{ACTIONS.map(({ title, text, path, icon: Icon, tone }) => <Link className="quick-action-card" key={path} to={path}>
      <span className={`quick-action-icon quick-action-${tone}`}><Icon size={19} aria-hidden="true" /></span>
      <span className="quick-action-copy"><strong>{title}</strong><small>{text}</small></span>
      <ArrowUpRight className="quick-action-arrow" size={16} aria-hidden="true" />
    </Link>)}</div>
  </section>
}
