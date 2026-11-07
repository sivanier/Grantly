import { useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import { AlertCircle, Bookmark, BookmarkCheck, CalendarDays, CheckCircle2, Clock3, Info } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import IconButton from '../ui/IconButton.jsx'
import { ROUTES } from '../../utils/constants.js'
import { getDaysUntil } from '../../utils/scholarshipSearch.js'
import { MATCH_STATUS } from '../../utils/scholarshipMatching.js'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'Deadline not listed'
const STATUS_CONFIG = {
  [MATCH_STATUS.eligible]: { label: 'Eligible on known criteria', tone: 'emerald', icon: CheckCircle2 },
  [MATCH_STATUS.potential]: { label: 'Potentially eligible', tone: 'indigo', icon: Info },
  [MATCH_STATUS.insufficient]: { label: 'Not enough information', tone: 'warning', icon: AlertCircle },
  [MATCH_STATUS.notEligible]: { label: 'Not eligible on known criteria', tone: 'warning', icon: AlertCircle },
}

export default function MatchResultCard({ scholarship, match, isSaved, onToggleSaved }) {
  const [saveError, setSaveError] = useState(false)
  const status = STATUS_CONFIG[match.status]
  const StatusIcon = status.icon
  const days = getDaysUntil(scholarship.deadline)
  const detailPath = generatePath(ROUTES.scholarshipDetails, { scholarshipId: scholarship.id })
  const handleSave = () => setSaveError(onToggleSaved(scholarship.id) === null)
  return <Card as="article" className="match-result-card">
    <div className="match-result-card-top"><Badge tone="neutral">{scholarship.category}</Badge><IconButton icon={isSaved ? BookmarkCheck : Bookmark} label={isSaved ? `Remove ${scholarship.name} from saved scholarships` : `Save ${scholarship.name}`} aria-pressed={isSaved} className={`save-scholarship${isSaved ? ' is-saved' : ''}`} onClick={handleSave} /></div>
    <p className="match-result-provider">{scholarship.provider} <span>· Fictional demo provider</span></p>
    <h2><Link to={detailPath}>{scholarship.name}</Link></h2>
    <div className="match-result-award"><span>Advertised award</span><strong>{formatINR(scholarship.awardAmount)}</strong></div>
    <div className="match-status-row"><Badge tone={status.tone} className="match-status-badge"><StatusIcon size={13} />{status.label}</Badge>{match.score !== null && <span className="match-score"><strong>{match.score}%</strong> illustrative compatibility</span>}</div>
    {match.score !== null && <p className="match-score-explanation">Based on {match.matches.length} matched out of {match.evaluatedCriteria} profile criteria that could be compared. It is not an eligibility probability.</p>}
    <div className="match-reason-groups">
      {match.matches.length > 0 && <section className="match-reason-group is-match"><h3><CheckCircle2 size={13} />Matches your profile</h3><ul>{match.matches.map((reason) => <li key={reason}>{reason}</li>)}</ul></section>}
      {match.failures.length > 0 && <section className="match-reason-group is-failure"><h3><AlertCircle size={13} />Does not match</h3><ul>{match.failures.map((reason) => <li key={reason}>{reason}</li>)}</ul></section>}
      {match.missing.length > 0 && <section className="match-reason-group is-missing"><h3><Info size={13} />Needs information or confirmation</h3><ul>{match.missing.map((reason) => <li key={reason}>{reason}</li>)}</ul></section>}
    </div>
    <div className="match-result-footer"><span className={`match-deadline${days >= 0 && days <= 7 ? ' is-soon' : ''}`}><CalendarDays size={14} /><span>{formatDate(scholarship.deadline)}{Number.isFinite(days) && days >= 0 ? ` · ${days === 0 ? 'Due today' : `${days} days left`}` : ''}</span></span><Button as={Link} to={detailPath} variant="secondary" size="sm">View details</Button></div>
    {saveError && <p className="save-error" role="status">Couldn’t save this scholarship in this browser. Check local storage settings.</p>}
  </Card>
}
