import { Bookmark, ChevronRight } from 'lucide-react'
import { Link, generatePath } from 'react-router-dom'
import { SCHOLARSHIP_LISTINGS } from '../../data/scholarships.js'
import { ROUTES } from '../../utils/constants.js'
import Card from '../ui/Card.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function SavedScholarshipsPreview({ savedIds }) {
  const saved = SCHOLARSHIP_LISTINGS.filter((scholarship) => savedIds.includes(scholarship.id))
  return <Card className="saved-preview-card">
    <SectionHeading title="Saved for later" description="Your saved demo scholarships on this device." action={<Link className="panel-icon-link" aria-label="View all saved scholarships" to={ROUTES.saved}><ChevronRight size={17} /></Link>} />
    {saved.length ? <ul className="saved-preview-list">{saved.map((scholarship) => <li key={scholarship.id}><Link to={generatePath(ROUTES.scholarshipDetails, { scholarshipId: scholarship.id })}><span><strong>{scholarship.name}</strong><small>{scholarship.category}</small></span><span className="saved-preview-award">{formatINR(scholarship.awardAmount)}</span></Link></li>)}</ul> : <EmptyState icon={Bookmark} title="Nothing saved yet" description="Bookmark a demo opportunity to keep it close at hand." action={<Link className="saved-preview-action" to={ROUTES.explore}>Explore scholarships</Link>} />}
  </Card>
}
