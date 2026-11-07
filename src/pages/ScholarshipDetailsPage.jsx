import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BellRing, Bookmark, CalendarDays, Check, Clock3, ExternalLink, GraduationCap, IndianRupee, Info, Sparkles } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { SCHOLARSHIP_DOCUMENTS, SCHOLARSHIP_LISTINGS_WITH_DETAILS, SCHOLARSHIPS_BY_ID } from '../data/scholarships.js'
import useSavedScholarships from '../hooks/useSavedScholarships.js'
import { getDaysUntil } from '../utils/scholarshipSearch.js'
import { getStudentDisplayName } from '../utils/studentProfile.js'
import { readLocalStorage, writeLocalStorage } from '../utils/localStorage.js'
import { SCHOLARSHIP_DETAIL_STORAGE, SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT, addDemoApplication, getDemoApplications, getDemoReminders, getDocumentProgress, saveDocumentProgress } from '../utils/scholarshipDetails.js'
import { ROUTES, STORAGE_KEYS } from '../utils/constants.js'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import PagePlaceholder from '../components/ui/PagePlaceholder.jsx'
import { ApplicationDemoDialog, ApplicationTimeline, DocumentChecklist, EligibilityPanel, SimilarScholarships } from '../components/scholarships/details/ScholarshipDetailSections.jsx'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export default function ScholarshipDetailsPage() {
  const { scholarshipId } = useParams()
  const scholarship = SCHOLARSHIPS_BY_ID[scholarshipId]
  if (!scholarship) return <PagePlaceholder eyebrow="Opportunity overview" title="Scholarship details" description="Review this opportunity before taking your next step." emptyTitle="This demo scholarship could not be found" emptyDescription="It may no longer be part of the sample listings." actionLabel="Back to scholarships" actionTo={ROUTES.explore} />
  return <ScholarshipDetailContent key={scholarship.id} scholarship={scholarship} />
}

function ScholarshipDetailContent({ scholarship }) {
  const location = useLocation()
  const { savedIds, toggleSaved } = useSavedScholarships()
  const saved = savedIds.includes(scholarship.id)
  const backTo = typeof location.state?.from === 'string' && location.state.from.startsWith('/') ? location.state.from : ROUTES.explore
  const [documents, setDocuments] = useState(() => getDocumentProgress(scholarship.id, SCHOLARSHIP_DOCUMENTS.map((item) => item.id)))
  const [reminderEnabled, setReminderEnabled] = useState(() => Boolean(getDemoReminders()[scholarship.id]))
  const [applicationRecords, setApplicationRecords] = useState(getDemoApplications)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const days = getDaysUntil(scholarship.deadline)
  const applied = applicationRecords.some((record) => record.scholarshipId === scholarship.id)
  const similar = useMemo(() => SCHOLARSHIP_LISTINGS_WITH_DETAILS.filter((item) => item.id !== scholarship.id).map((item) => ({
    item,
    score: Number(item.category === scholarship.category) * 3 + Number(item.educationLevels.some((level) => scholarship.educationLevels.includes(level))) * 2 + Number(item.fieldsOfStudy.some((field) => scholarship.fieldsOfStudy.includes(field))),
  })).sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name)).slice(0, 3).map(({ item }) => item), [scholarship])
  const profile = readLocalStorage(STORAGE_KEYS.profile, {}) || {}

  useEffect(() => { saveDocumentProgress(scholarship.id, documents) }, [documents, scholarship.id])

  const toggleDocument = (id) => setDocuments((current) => ({ ...current, [id]: !current[id] }))
  const resetDocuments = () => setDocuments(Object.fromEntries(SCHOLARSHIP_DOCUMENTS.map(({ id }) => [id, false])))
  const toggleReminder = () => {
    const reminders = getDemoReminders()
    const nextValue = !reminders[scholarship.id]
    if (nextValue) reminders[scholarship.id] = true
    else delete reminders[scholarship.id]
    if (writeLocalStorage(SCHOLARSHIP_DETAIL_STORAGE.reminders, reminders)) {
      setReminderEnabled(nextValue)
      window.dispatchEvent(new Event(SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT))
    }
  }
  const confirmApplication = () => {
    const result = addDemoApplication({ scholarshipId: scholarship.id, status: 'Applied', createdAt: new Date().toISOString(), demo: true })
    if (result.saved) {
      setApplicationRecords(result.records)
      setApplicationSuccess(true)
    }
  }
  const openApplyDialog = () => { setApplicationSuccess(applied); setDialogOpen(true) }

  return <PageContainer className="scholarship-detail-page scholarship-detail-v2">
    <div className="detail-back-row"><Link to={backTo} className="detail-back-link"><ArrowLeft size={15} />Back to scholarships</Link><span className="detail-breadcrumb">Scholarships <span>/</span> Opportunity details</span></div>
    <PageHeader eyebrow="Fictional demo opportunity" title={scholarship.name} description={scholarship.description} action={<div className="detail-header-actions"><Button variant="secondary" aria-pressed={saved} aria-label={saved ? `Remove ${scholarship.name} from saved scholarships` : `Save ${scholarship.name}`} onClick={() => toggleSaved(scholarship.id)}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save scholarship'}</Button><Button onClick={openApplyDialog} disabled={applied}><ExternalLink size={15} />{applied ? 'Added to tracker' : 'Apply now'}</Button></div>} />

    <div className="detail-demo-notice"><Info size={16} /><p><strong>Demonstration content.</strong> This scholarship, provider, requirements, dates and award are fictional examples. Award amounts are advertised values, not guaranteed funding or money received.</p></div>

    <div className="detail-overview-grid">
      <Card className="detail-overview-card">
        <div className="detail-overview-top"><div className="detail-provider-lockup"><span className="detail-provider-mark"><GraduationCap size={20} /></span><div><span className="detail-provider-name">{scholarship.provider}</span><span className="detail-provider-type">Fictional demo provider</span></div></div><Badge tone="neutral">{scholarship.category}</Badge></div>
        <div className="detail-award-highlight"><div><span className="detail-label">Advertised award value</span><strong>{formatINR(scholarship.awardAmount)}</strong><span className="detail-award-terms">{scholarship.awardFrequency} · {scholarship.duration}</span></div><span className="detail-award-icon"><IndianRupee size={22} /></span></div>
        <div className="detail-facts detail-facts-v2"><div><GraduationCap size={16} /><span><strong>Education level</strong>{scholarship.educationLevels.join(', ')}</span></div><div><CalendarDays size={16} /><span><strong>Application deadline · demo</strong>{formatDate(scholarship.deadline)}</span></div><div><Clock3 size={16} /><span><strong>Award frequency</strong>{scholarship.awardFrequency}</span></div><div><Sparkles size={16} /><span><strong>Available awards · demo</strong>{scholarship.awardsAvailable} illustrative awards</span></div></div>
        <section className="detail-description-section"><h2>About this opportunity</h2><p>{scholarship.description}</p><div className="detail-tag-list">{scholarship.fieldsOfStudy.map((field) => <Badge tone="indigo" key={field}>{field}</Badge>)}</div></section>
        <p className="detail-disclaimer">This is fictional scholarship and provider information created for product demonstration. Verify any real opportunity independently before sharing personal information.</p>
      </Card>
      <Card className={`detail-deadline-card ${days <= 7 ? 'is-urgent' : ''}`}>
        <div className="deadline-card-top"><span className="deadline-card-icon"><CalendarDays size={18} /></span><Badge tone={days < 0 ? 'neutral' : days <= 7 ? 'warning' : 'emerald'}>{days < 0 ? 'Date passed' : days === 0 ? 'Due today' : days <= 7 ? 'Closing soon' : 'Upcoming'}</Badge></div>
        <p className="detail-label">Demo application deadline</p><h2>{formatDate(scholarship.deadline)}</h2><p className="deadline-countdown">{days < 0 ? 'This sample deadline has passed.' : days === 0 ? 'The sample deadline is today.' : `${days} days remaining in this demo listing.`}</p>
        <div className="deadline-award-row"><span>Advertised award</span><strong>{formatINR(scholarship.awardAmount)}</strong></div>
        <Button variant={reminderEnabled ? 'secondary' : 'primary'} className="deadline-reminder-button" aria-pressed={reminderEnabled} onClick={toggleReminder}><BellRing size={15} />{reminderEnabled ? 'Reminder saved' : 'Remind me'}</Button>
        <p className="reminder-note">{reminderEnabled ? 'Reminder preference saved on this device. No notification will be sent.' : 'Save a local reminder preference. No notification is sent.'}</p>
      </Card>
    </div>

    <div className="detail-content-grid">
      <div className="detail-main-column"><EligibilityPanel scholarship={scholarship} profile={profile} /><ApplicationTimeline /></div>
      <div className="detail-side-column"><DocumentChecklist scholarship={scholarship} documents={SCHOLARSHIP_DOCUMENTS} progress={documents} onToggle={toggleDocument} onReset={resetDocuments} /><Card className="detail-next-step"><span className="detail-heading-icon"><Check size={16} /></span><div><h2>Ready to take the next step?</h2><p>Use the demo flow to add this opportunity to your local application tracker.</p></div><Button className="next-step-button" onClick={openApplyDialog} disabled={applied}>{applied ? 'Already in tracker' : 'Start demo application'}</Button><Link to={ROUTES.smartMatch} className="smart-match-link">Explore Smart Match <ArrowLeft size={13} /></Link></Card></div>
    </div>

    <SimilarScholarships scholarships={similar} />
    <ApplicationDemoDialog open={dialogOpen} scholarship={scholarship} applied={applied} success={applicationSuccess} onClose={() => setDialogOpen(false)} onConfirm={confirmApplication} />
  </PageContainer>
}
