import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowDownWideNarrow, ArrowUpRight, CalendarClock, CheckCircle2, Clock3, FileCheck2, ListFilter, Search, Send, Sparkles, X } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import TrackerApplicationCard from '../components/tracker/TrackerApplicationCard.jsx'
import RemoveApplicationDialog from '../components/tracker/RemoveApplicationDialog.jsx'
import { SCHOLARSHIPS_BY_ID } from '../data/scholarships.js'
import { getDaysUntil } from '../utils/scholarshipSearch.js'
import { getDemoApplications, SCHOLARSHIP_DETAIL_STORAGE, saveDemoApplications } from '../utils/scholarshipDetails.js'
import { ROUTES } from '../utils/constants.js'

const APPLICATION_STATUSES = ['Applied', 'Shortlisted', 'Rejected']
const STATUS_FILTERS = ['All applications', ...APPLICATION_STATUSES]

function StatTile({ icon: Icon, label, value, tone }) {
  return <Card className="tracker-stat-tile"><span className={`tracker-stat-icon ${tone}`}><Icon size={17} /></span><div><span>{label}</span><strong>{value}</strong></div></Card>
}

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState(getDemoApplications)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All applications')
  const [sortBy, setSortBy] = useState('newest')
  const [removeTarget, setRemoveTarget] = useState(null)
  const [message, setMessage] = useState('')
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    const syncApplications = (event) => {
      if (event.key === SCHOLARSHIP_DETAIL_STORAGE.applications) setApplications(getDemoApplications())
    }
    window.addEventListener('storage', syncApplications)
    return () => window.removeEventListener('storage', syncApplications)
  }, [])

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter((record) => record.status === 'Applied').length,
    shortlisted: applications.filter((record) => record.status === 'Shortlisted').length,
    rejected: applications.filter((record) => record.status === 'Rejected').length,
    upcoming: applications.filter((record) => {
      const scholarship = SCHOLARSHIPS_BY_ID[record.scholarshipId]
      return scholarship?.deadline && getDaysUntil(scholarship.deadline) >= 0
    }).length,
  }), [applications])

  const visibleApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const filtered = applications.filter((record) => {
      const scholarship = SCHOLARSHIPS_BY_ID[record.scholarshipId]
      const matchesQuery = !normalizedQuery || [scholarship?.name, scholarship?.provider, record.scholarshipId].filter(Boolean).join(' ').toLocaleLowerCase().includes(normalizedQuery)
      return matchesQuery && (statusFilter === 'All applications' || record.status === statusFilter)
    })
    return filtered.sort((a, b) => {
      if (sortBy === 'oldest') return (Date.parse(a.createdAt || '') || 0) - (Date.parse(b.createdAt || '') || 0)
      if (sortBy === 'deadline') return getDaysUntil(SCHOLARSHIPS_BY_ID[a.scholarshipId]?.deadline) - getDaysUntil(SCHOLARSHIPS_BY_ID[b.scholarshipId]?.deadline)
      return (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0)
    })
  }, [applications, query, statusFilter, sortBy])

  const persist = (next, successMessage) => {
    const saved = saveDemoApplications(next)
    setStorageError(!saved)
    if (saved) {
      setApplications(getDemoApplications())
      setMessage(successMessage)
    }
  }
  const updateRecord = (scholarshipId, patch, successMessage) => {
    const current = getDemoApplications()
    if (!current.some((record) => record.scholarshipId === scholarshipId)) return
    const now = new Date().toISOString()
    const recordPatch = Object.prototype.hasOwnProperty.call(patch, 'status') ? { ...patch, statusUpdatedAt: now } : patch
    persist(current.map((record) => record.scholarshipId === scholarshipId ? { ...record, ...recordPatch, updatedAt: now } : record), successMessage)
  }
  const handleStatusChange = (scholarshipId, status) => {
    if (!APPLICATION_STATUSES.includes(status)) return
    updateRecord(scholarshipId, { status }, 'Application status updated locally.')
  }
  const handleNotesSave = (scholarshipId, notes) => updateRecord(scholarshipId, { notes: notes.slice(0, 500) }, 'Application note saved locally.')
  const confirmRemove = () => {
    if (!removeTarget) return
    const next = getDemoApplications().filter((record) => record.scholarshipId !== removeTarget.scholarshipId)
    persist(next, 'Demo application removed from this browser.')
    setRemoveTarget(null)
  }
  const clearFilters = () => { setQuery(''); setStatusFilter('All applications'); setSortBy('newest') }
  const hasFilters = Boolean(query || statusFilter !== 'All applications' || sortBy !== 'newest')

  return <PageContainer className="application-tracker-page tracker-dashboard-page">
    <PageHeader eyebrow="Stay on track" title="Application tracker" description="Manage your scholarship application journey, notes, and upcoming deadlines in one place." action={<Button as={Link} to={ROUTES.explore} variant="secondary"><Sparkles size={15} />Explore scholarships</Button>} />
    <div className="tracker-demo-notice"><AlertCircle size={16} /><p>GRANTLY is a frontend demonstration. Application records are stored locally in this browser. Changing a status or adding notes does not submit an application to a scholarship provider.</p></div>

    <section className="tracker-overview" aria-label="Application overview">
      <StatTile icon={FileCheck2} label="Total applications" value={stats.total} tone="indigo" />
      <StatTile icon={Send} label="Applied" value={stats.applied} tone="blue" />
      <StatTile icon={CheckCircle2} label="Shortlisted" value={stats.shortlisted} tone="green" />
      <StatTile icon={X} label="Rejected" value={stats.rejected} tone="amber" />
      <StatTile icon={CalendarClock} label="Upcoming deadlines" value={stats.upcoming} tone="purple" />
    </section>

    {applications.length > 0 && <>
      <Card className="tracker-toolbar">
        <label className="tracker-search"><Search size={16} /><span className="sr-only">Search applications</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scholarship or provider" /></label>
        <div className="tracker-toolbar-controls"><label className="tracker-select-control"><ListFilter size={14} /><span className="sr-only">Filter by application status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{STATUS_FILTERS.map((status) => <option key={status}>{status}</option>)}</select></label><label className="tracker-select-control"><ArrowDownWideNarrow size={14} /><span className="sr-only">Sort applications</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="newest">Newest application</option><option value="oldest">Oldest application</option><option value="deadline">Nearest deadline</option></select></label>{hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X size={13} />Clear filters</Button>}</div>
      </Card>
      <div className="tracker-list-heading"><div><h2>Applications <span>{visibleApplications.length}</span></h2><p>Showing {visibleApplications.length} of {applications.length} local demo records.</p></div><span className="tracker-list-caption"><Clock3 size={13} />Updated dates are shown when available</span></div>
    </>}

    {storageError && <p className="tracker-storage-error" role="alert">This browser could not save the change. Check local storage availability and try again.</p>}
    {message && <p className="tracker-action-message" role="status">{message}</p>}

    {applications.length === 0 ? <Card className="tracker-empty-card"><EmptyState icon={FileCheck2} title="No applications in your tracker yet" description="When you confirm a demo application from a scholarship’s details page, its local record will appear here. Bookmarks stay separate and are not counted as applications." action={<Button as={Link} to={ROUTES.explore}>Explore scholarships <ArrowUpRight size={15} /></Button>} /></Card> : visibleApplications.length === 0 ? <Card className="tracker-empty-card"><EmptyState icon={Search} title="No applications match these filters" description="Try a different search term or status, or clear your filters to see all application records." action={<Button variant="secondary" onClick={clearFilters}>Clear search and filters</Button>} /></Card> : <div className="tracker-application-list">{visibleApplications.map((record) => <TrackerApplicationCard key={record.scholarshipId} record={record} scholarship={SCHOLARSHIPS_BY_ID[record.scholarshipId]} onStatusChange={handleStatusChange} onNotesSave={handleNotesSave} onRemove={setRemoveTarget} />)}</div>}
    <RemoveApplicationDialog record={removeTarget} scholarshipName={SCHOLARSHIPS_BY_ID[removeTarget?.scholarshipId]?.name} onCancel={() => setRemoveTarget(null)} onConfirm={confirmRemove} />
  </PageContainer>
}
