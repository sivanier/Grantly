import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowUpRight, Bookmark, CalendarDays, IndianRupee, Search } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import useSavedScholarships from '../hooks/useSavedScholarships.js'
import { SCHOLARSHIP_LISTINGS_WITH_DETAILS } from '../data/scholarships.js'
import { ROUTES } from '../utils/constants.js'
import { getDaysUntil } from '../utils/scholarshipSearch.js'
import { getUnavailableSavedIds, resolveSavedScholarships } from '../utils/savedScholarships.js'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const formatDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Deadline not provided'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day))
}

export default function SavedScholarshipsPage() {
  const { savedIds, toggleSaved, removeSaved } = useSavedScholarships()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('deadline')
  const savedRecords = useMemo(() => {
    return resolveSavedScholarships(savedIds, SCHOLARSHIP_LISTINGS_WITH_DETAILS)
  }, [savedIds])
  const unavailableIds = getUnavailableSavedIds(savedIds, SCHOLARSHIP_LISTINGS_WITH_DETAILS)
  const invalidCount = unavailableIds.length
  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    const matches = savedRecords.filter((item) => !normalized || `${item.name} ${item.provider} ${item.category}`.toLocaleLowerCase().includes(normalized))
    return [...matches].sort((a, b) => {
      if (sortBy === 'award') return b.awardAmount - a.awardAmount || a.name.localeCompare(b.name)
      return getDaysUntil(a.deadline) - getDaysUntil(b.deadline) || a.name.localeCompare(b.name)
    })
  }, [query, savedRecords, sortBy])

  return <PageContainer className="saved-scholarships-page">
    <PageHeader eyebrow="Your shortlist" title="Saved scholarships" description="Keep promising opportunities together and review their deadlines when you’re ready." action={<Button as={Link} to={ROUTES.explore} variant="secondary"><Search size={15} />Explore scholarships</Button>} />
    <div className="saved-summary-row"><Card className="saved-summary-card"><span className="saved-summary-icon"><Bookmark size={17} /></span><div><small>Saved opportunities</small><strong>{savedRecords.length}</strong></div><span className="saved-summary-caption">Stored on this device</span></Card><p className="saved-demo-note">Fictional scholarship examples · Advertised awards are not guaranteed funding.</p></div>

    {invalidCount > 0 && <div className="saved-invalid-note" role="status"><p>{invalidCount} saved {invalidCount === 1 ? 'item is' : 'items are'} no longer in the demo scholarship list.</p><Button size="sm" variant="secondary" onClick={() => removeSaved(unavailableIds)}>Remove unavailable items</Button></div>}

    {savedRecords.length > 0 && <Card className="saved-toolbar"><label className="saved-search"><Search size={16} /><span className="sr-only">Search saved scholarships</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved scholarships" /></label><label className="saved-sort"><ArrowDownWideNarrow size={14} /><span className="sr-only">Sort saved scholarships</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="deadline">Deadline: soonest first</option><option value="award">Award: highest first</option></select></label><span className="saved-result-count">Showing {visibleRecords.length} of {savedRecords.length}</span></Card>}

    {savedRecords.length === 0 ? <Card className="saved-empty-card"><EmptyState icon={Bookmark} title="Your shortlist is ready when you are" description="Save a scholarship from Explore or its details page. Saved items stay separate from demo applications in your tracker." action={<Button as={Link} to={ROUTES.explore}>Explore scholarships <ArrowUpRight size={15} /></Button>} /></Card> : visibleRecords.length === 0 ? <Card className="saved-empty-card"><EmptyState icon={Search} title="No saved scholarships match" description="Try a different search term to find an item in your shortlist." action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>} /></Card> : <div className="saved-scholarship-grid">{visibleRecords.map((item) => <SavedCard key={item.id} scholarship={item} onRemove={() => toggleSaved(item.id)} />)}</div>}
  </PageContainer>
}

function SavedCard({ scholarship, onRemove }) {
  const days = getDaysUntil(scholarship.deadline)
  return <Card as="article" className="saved-scholarship-card">
    <div className="saved-card-top"><Badge tone="indigo">{scholarship.category}</Badge></div>
    <p className="saved-provider">{scholarship.provider} · Fictional demo provider</p><h2>{scholarship.name}</h2><p className="saved-award-label"><IndianRupee size={14} />Advertised award</p><strong className="saved-award">{formatINR(scholarship.awardAmount)}</strong>
    <div className="saved-deadline"><CalendarDays size={15} /><span><small>Scholarship deadline</small><strong>{formatDate(scholarship.deadline)}</strong></span><Badge tone={days < 0 ? 'neutral' : days <= 7 ? 'warning' : 'success'}>{days < 0 ? 'Closed' : days === 0 ? 'Today' : `${days} days`}</Badge></div>
    <div className="saved-card-actions"><Button as={Link} to={ROUTES.scholarshipDetails.replace(':scholarshipId', scholarship.id)} variant="secondary">View details <ArrowUpRight size={14} /></Button><Button variant="ghost" onClick={onRemove} aria-label={`Remove ${scholarship.name} from saved list`}>Remove from saved</Button></div>
  </Card>
}
