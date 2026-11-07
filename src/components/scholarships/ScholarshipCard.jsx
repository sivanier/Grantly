import { useState } from 'react'
import { Bookmark, BookmarkCheck, CalendarDays, ChevronRight, GraduationCap } from 'lucide-react'
import { Link, generatePath, useLocation } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'
import { getDaysUntil } from '../../utils/scholarshipSearch.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import IconButton from '../ui/IconButton.jsx'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

function getDeadlineStatus(days) {
  if (days < 0) return { tone: 'neutral', text: 'Demo date passed', className: 'deadline-past' }
  if (days <= 7) return { tone: 'warning', text: days === 0 ? 'Due today' : `${days} days left`, className: 'deadline-urgent' }
  if (days <= 21) return { tone: 'warning', text: `${days} days left`, className: 'deadline-approaching' }
  return { tone: 'emerald', text: `${days} days left`, className: 'deadline-upcoming' }
}

export default function ScholarshipCard({ scholarship, isSaved, onToggleSaved, variant = 'dashboard' }) {
  const [saveError, setSaveError] = useState(false)
  const location = useLocation()
  const detailPath = generatePath(ROUTES.scholarshipDetails, { scholarshipId: scholarship.id })
  const detailState = { from: `${location.pathname}${location.search}` }
  const days = getDaysUntil(scholarship.deadline)
  const deadline = getDeadlineStatus(days)
  function handleSave() {
    const saved = onToggleSaved(scholarship.id)
    setSaveError(saved === null)
  }

  return <Card as="article" className={`scholarship-card${variant === 'market' ? ' market-scholarship-card' : ''}`}>
    <div className="scholarship-card-top"><Badge tone="neutral">{scholarship.category}</Badge><IconButton icon={isSaved ? BookmarkCheck : Bookmark} label={isSaved ? `Remove ${scholarship.name} from saved scholarships` : `Save ${scholarship.name}`} aria-pressed={isSaved} className={`save-scholarship${isSaved ? ' is-saved' : ''}`} onClick={handleSave} /></div>
    <div className="scholarship-provider">{scholarship.provider} <span>· Fictional demo provider</span></div>
    <h3><Link to={detailPath} state={detailState}>{scholarship.name}</Link></h3>
    {variant === 'market' && <p className="market-scholarship-description">{scholarship.description}</p>}
    <div className="scholarship-award"><span>Advertised award</span><strong>{formatINR(scholarship.awardAmount)}</strong></div>
    {variant === 'market' && <>
      <div className="market-education"><GraduationCap size={14} aria-hidden="true" /><span>{scholarship.educationLevels.join(' · ')}</span></div>
      <p className="scholarship-eligibility"><strong>Eligibility focus</strong> · {scholarship.eligibility}</p>
      <p className="market-fields"><span>Fields</span> {scholarship.fieldsOfStudy.join(', ')}</p>
    </>}
    {variant !== 'market' && <p className="scholarship-eligibility">{scholarship.eligibility}</p>}
    <div className="scholarship-meta">
      <span><CalendarDays size={14} aria-hidden="true" /> Demo deadline · {formatDate(scholarship.deadline)}</span>
      {variant === 'market' ? <Badge tone={deadline.tone} className={`market-deadline ${deadline.className}`}>{deadline.text}</Badge> : <Badge tone="indigo">{scholarship.matchScore}% illustrative match</Badge>}
      {variant === 'market' && <span className="market-eligibility-types">Eligibility type · {scholarship.eligibilityTypes.join(', ')}</span>}
    </div>
    <div className="scholarship-card-footer">
      <Button as={Link} to={detailPath} state={detailState} variant="secondary" size="sm">View details <ChevronRight size={14} aria-hidden="true" /></Button>
      <span className="scholarship-demo-label">DEMO</span>
    </div>
    {saveError && <p role="status" className="save-error">Couldn’t save this scholarship in this browser. Please check your storage settings.</p>}
  </Card>
}
