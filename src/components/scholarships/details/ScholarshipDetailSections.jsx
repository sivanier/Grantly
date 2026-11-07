import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Check, CheckCircle2, Circle, FileText, GraduationCap, Landmark, MapPin, RotateCcw, School, UserRound, Wallet } from 'lucide-react'
import Badge from '../../ui/Badge.jsx'
import Button from '../../ui/Button.jsx'
import Card from '../../ui/Card.jsx'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

function RequirementStatus({ meets }) {
  const label = meets === null ? 'Not yet provided' : meets ? 'Meets requirement' : 'Does not meet requirement'
  return <Badge tone={meets === null ? 'neutral' : meets ? 'emerald' : 'warning'} className="requirement-status">{meets === null ? <Circle size={12} /> : meets ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}{label}</Badge>
}

export function EligibilityPanel({ scholarship, profile }) {
  const criteria = scholarship.criteria
  const education = profile.educationLevel || profile.studyLevel || profile.education?.level
  const field = profile.fieldOfStudy || profile.course || profile.academic?.fieldOfStudy
  const rawPercentage = profile.academicPercentage ?? profile.percentage ?? profile.academic?.percentage
  const rawIncome = profile.annualFamilyIncome ?? profile.familyIncome ?? profile.financial?.annualFamilyIncome
  const percentage = rawPercentage === '' || rawPercentage == null ? Number.NaN : Number(rawPercentage)
  const income = rawIncome === '' || rawIncome == null ? Number.NaN : Number(rawIncome)
  const rows = [
    { label: 'Education level', value: criteria.education.join(', '), meets: education ? criteria.education.some((level) => level.toLowerCase() === String(education).toLowerCase()) : null, icon: GraduationCap },
    { label: 'Course / field of study', value: criteria.fields.join(', '), meets: field ? criteria.fields.some((item) => item.toLowerCase() === String(field).toLowerCase()) : null, icon: School },
    ...(criteria.minimumPercentage ? [{ label: 'Minimum academic score', value: `${criteria.minimumPercentage}% (illustrative)`, meets: Number.isFinite(percentage) ? percentage >= criteria.minimumPercentage : null, icon: Check } ] : []),
    ...(criteria.incomeLimit ? [{ label: 'Annual family income', value: `Up to ${formatINR(criteria.incomeLimit)} (illustrative)`, meets: Number.isFinite(income) ? income <= criteria.incomeLimit : null, icon: Wallet } ] : []),
    { label: 'Location', value: criteria.location, meets: profile.country ? (criteria.location.toLowerCase().includes('india') ? String(profile.country).toLowerCase() === 'india' : null) : null, icon: MapPin },
    { label: 'Additional conditions', value: criteria.conditions.join(' · '), meets: null, icon: UserRound },
  ]
  const comparisonsAvailable = rows.some((row) => row.meets !== null)
  return <Card className="detail-panel eligibility-panel">
    <div className="detail-panel-heading"><span className="detail-heading-icon"><CheckCircle2 size={17} /></span><div><h2>Eligibility criteria</h2><p>{comparisonsAvailable ? 'Compared only with information in your saved profile.' : 'Add profile details to see a personalized comparison.'}</p></div></div>
    <div className="eligibility-rows">{rows.map(({ label, value, meets, icon: Icon }) => <div className="eligibility-row" key={label}><span className="eligibility-row-icon"><Icon size={15} /></span><div className="eligibility-row-copy"><strong>{label}</strong><span>{value}</span></div><RequirementStatus meets={meets} /></div>)}</div>
    <p className="detail-footnote">Criteria shown are fictional examples for this demo listing. Confirm actual requirements with the relevant provider.</p>
  </Card>
}

export function DocumentChecklist({ scholarship, documents, progress, onToggle, onReset }) {
  const readyCount = documents.filter(({ id }) => progress[id]).length
  const percent = Math.round((readyCount / documents.length) * 100)
  return <Card className="detail-panel document-panel">
    <div className="detail-panel-heading"><span className="detail-heading-icon green"><FileText size={17} /></span><div><h2>Document checklist</h2><p>Keep your preparation organized for this opportunity.</p></div></div>
    <div className="document-progress-copy"><span>{readyCount} of {documents.length} ready</span><strong>{percent}%</strong></div>
    <div className="document-progress-track" role="progressbar" aria-label="Document checklist completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
    <div className="document-checklist">{documents.map((document) => <label key={document.id} className={`document-check-row ${progress[document.id] ? 'is-ready' : ''}`}><input type="checkbox" checked={Boolean(progress[document.id])} onChange={() => onToggle(document.id)} /><span className="document-custom-check" aria-hidden="true">{progress[document.id] && <Check size={14} />}</span><span>{document.label}</span><small>{progress[document.id] ? 'Ready' : 'Pending'}</small></label>)}</div>
    <div className="document-panel-footer"><p>Requirements vary by scholarship. This sample checklist is for planning only.</p><Button variant="ghost" size="sm" onClick={onReset} disabled={!readyCount}><RotateCcw size={13} />Reset checklist</Button></div>
  </Card>
}

const steps = [
  ['Review eligibility', 'Read the criteria carefully and confirm the details that apply to you.'],
  ['Prepare your documents', 'Gather current copies of the documents requested by the provider.'],
  ['Complete the application form', 'Enter your academic and personal information accurately.'],
  ['Upload supporting documents', 'Check each file is clear, complete, and in the requested format.'],
  ['Review and submit', 'Review the full application and submit through the provider’s official channel.'],
]
export function ApplicationTimeline() {
  return <Card className="detail-panel process-panel"><div className="detail-panel-heading"><span className="detail-heading-icon"><Landmark size={17} /></span><div><h2>Application process</h2><p>A practical guide to preparing an application.</p></div></div><ol className="application-steps">{steps.map(([title, description], index) => <li key={title}><span className="application-step-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></Card>
}

export function SimilarScholarships({ scholarships }) {
  if (!scholarships.length) return null
  return <section className="similar-scholarships"><div className="detail-section-title"><div><h2>More opportunities to explore</h2><p>Related fictional demo scholarships from the same sample collection.</p></div></div><div className="similar-grid">{scholarships.map((item) => <Card as="article" className="similar-card" key={item.id}><div className="similar-card-meta"><Badge tone="neutral">{item.category}</Badge><span>{formatINR(item.awardAmount)}</span></div><h3>{item.name}</h3><p>{item.provider}</p><Link to={`/scholarships/${item.id}`} className="similar-link">View opportunity <span aria-hidden="true">→</span></Link></Card>)}</div></section>
}

export function ApplicationDemoDialog({ open, scholarship, applied, onClose, onConfirm, success }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open, success])
  if (!scholarship) return null
  return <dialog ref={dialogRef} className="demo-application-dialog" aria-labelledby="demo-application-title" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === dialogRef.current) onClose() }}>
    <button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
    {success ? <div className="application-success"><span className="application-success-icon"><CheckCircle2 size={30} /></span><p className="page-eyebrow">Demo flow complete</p><h2 id="demo-application-title">Your demo application is tracked</h2><p><strong>{scholarship.name}</strong> has been added to your local application tracker with the status <b>Applied</b>.</p><div className="demo-flow-notice"><AlertCircle size={16} />No real application was submitted to an institution. This is a local product demonstration only.</div><div className="dialog-actions"><Button variant="secondary" onClick={onClose}>Close</Button><Button as={Link} to="/applications" onClick={onClose}>View application tracker</Button></div></div> : <div className="application-confirmation"><span className="detail-heading-icon"><FileText size={18} /></span><p className="page-eyebrow">Frontend demo</p><h2 id="demo-application-title">Start a demo application?</h2><p>This will create a local sample record for <strong>{scholarship.name}</strong>. No information will be sent to a provider.</p><div className="demo-application-summary"><span>Fictional provider<strong>{scholarship.provider}</strong></span><span>Advertised award<strong>{formatINR(scholarship.awardAmount)}</strong></span><span>Tracker status<strong>{applied ? 'Already applied' : 'Applied'}</strong></span></div><div className="demo-flow-notice"><AlertCircle size={16} />This is not an official application and does not guarantee funding.</div><div className="dialog-actions"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={applied} onClick={onConfirm}>{applied ? 'Already in tracker' : 'Confirm demo application'}</Button></div></div>}
  </dialog>
}
