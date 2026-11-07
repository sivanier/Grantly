import { useMemo } from 'react'
import { BookmarkCheck, CheckCircle2, FileCheck2, Sparkles, UserRound } from 'lucide-react'
import { DEMO_ACTIVITY } from '../../data/scholarships.js'
import Card from '../ui/Card.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

const ACTIVITY_ICONS = { submitted: FileCheck2, saved: BookmarkCheck, profile: UserRound, assessment: Sparkles }

export default function ActivityTimeline({ activities = DEMO_ACTIVITY }) {
  const items = useMemo(() => activities ?? [], [activities])
  return <Card className="dashboard-panel activity-panel">
    <SectionHeading title="Application activity" description="Sample activity · not account history" />
    {items.length ? <ol className="activity-list">{items.map((item, index) => {
      const Icon = ACTIVITY_ICONS[item.kind] || CheckCircle2
      return <li key={item.id} className="activity-item">
        <span className={`activity-icon activity-icon-${item.kind}`}><Icon size={15} aria-hidden="true" /></span>
        {index < items.length - 1 && <span className="activity-connector" aria-hidden="true" />}
        <div className="activity-copy"><div className="activity-title-row"><strong>{item.label}</strong><span className="activity-demo-chip">SAMPLE</span></div><p>{item.detail}</p><time>{item.time}</time></div>
      </li>
    })}</ol> : <EmptyState icon={FileCheck2} title="No recent activity" description="Your scholarship actions will appear here when you get started." />}
  </Card>
}
