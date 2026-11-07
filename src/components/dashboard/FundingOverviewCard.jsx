import { ArrowUpRight, BadgeIndianRupee, ShieldCheck } from 'lucide-react'
import { DEMO_SCHOLARSHIPS } from '../../data/scholarships.js'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function FundingOverviewCard() {
  const advertisedTotal = DEMO_SCHOLARSHIPS.reduce((sum, scholarship) => sum + scholarship.awardAmount, 0)
  return <Card className="funding-overview-card">
    <div className="funding-card-top"><Badge tone="emerald"><span className="funding-live-dot" /> Illustrative opportunity</Badge><span className="funding-sparkle" aria-hidden="true"><ArrowUpRight size={18} /></span></div>
    <div className="funding-main">
      <div><p className="funding-label">Combined advertised award value</p><p className="funding-amount">{formatINR(advertisedTotal)}</p></div>
      <div className="funding-icon"><BadgeIndianRupee size={23} strokeWidth={1.8} aria-hidden="true" /></div>
    </div>
    <div className="funding-range" aria-label="Four sample scholarship awards total 250,000 rupees"><span /><span /><span /><span /></div>
    <p className="funding-explainer"><ShieldCheck size={14} aria-hidden="true" /> Combined advertised value of selected demo scholarships. This is not guaranteed funding or money received.</p>
  </Card>
}
