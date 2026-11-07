import { useEffect, useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import { CalendarDays, Clock3, FileText, Pencil, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import { ROUTES } from '../../utils/constants.js'
import { getDaysUntil } from '../../utils/scholarshipSearch.js'

const formatINR = (amount) => Number.isFinite(Number(amount)) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount)) : 'Not listed'
const formatDate = (value) => {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Not recorded'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}
const STATUS_TONE = { Applied: 'indigo', Shortlisted: 'emerald', Rejected: 'warning' }

export default function TrackerApplicationCard({ record, scholarship, onStatusChange, onNotesSave, onRemove }) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState(record.notes || '')
  useEffect(() => setNotes(record.notes || ''), [record.notes])
  const status = typeof record.status === 'string' && record.status.trim() ? record.status : 'Status not set'
  const knownStatus = Object.hasOwn(STATUS_TONE, status)
  const days = scholarship?.deadline ? getDaysUntil(scholarship.deadline) : Number.POSITIVE_INFINITY
  const detailPath = scholarship ? generatePath(ROUTES.scholarshipDetails, { scholarshipId: scholarship.id }) : null

  const saveNotes = () => {
    onNotesSave(record.scholarshipId, notes.trim())
    setEditingNotes(false)
  }
  const cancelNotes = () => {
    setNotes(record.notes || '')
    setEditingNotes(false)
  }

  return <Card as="article" className="tracker-record-card">
    <div className="tracker-record-heading">
      <div className="tracker-record-title"><div className="tracker-record-badges"><Badge tone={knownStatus ? STATUS_TONE[status] : 'neutral'}>{status}</Badge>{record.demo && <Badge tone="neutral">Demo record</Badge>}</div><h2>{scholarship?.name || 'Scholarship listing unavailable'}</h2><p>{scholarship ? `${scholarship.provider} · Fictional demo provider` : `Listing ID: ${record.scholarshipId}`}</p></div>
      <label className="tracker-status-control"><span>Application status</span><select value={status} onChange={(event) => onStatusChange(record.scholarshipId, event.target.value)} aria-label={`Change status for ${scholarship?.name || record.scholarshipId}`}><option value={status}>{knownStatus ? status : `Preserve existing: ${status}`}</option>{['Applied', 'Shortlisted', 'Rejected'].filter((option) => option !== status).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
    </div>
    <div className="tracker-record-facts">
      <div><span>Advertised award</span><strong>{formatINR(scholarship?.awardAmount)}</strong></div>
      <div><span>Application date</span><strong>{formatDate(record.createdAt)}</strong></div>
      <div><span>Scholarship deadline</span><strong>{scholarship ? `${formatDate(scholarship.deadline)}${Number.isFinite(days) && days >= 0 ? ` · ${days} days left` : days < 0 ? ' · passed' : ''}` : 'Not available'}</strong></div>
      <div><span>Last updated</span><strong>{formatDate(record.updatedAt)}</strong></div>
    </div>
    <section className="tracker-note-section" aria-label="Application notes">
      <div className="tracker-note-heading"><h3><FileText size={14} />Personal note</h3>{!editingNotes && <Button variant="ghost" size="sm" aria-label={`${record.notes ? 'Edit' : 'Add'} note for ${scholarship?.name || record.scholarshipId}`} onClick={() => setEditingNotes(true)}><Pencil size={13} />{record.notes ? 'Edit note' : 'Add note'}</Button>}</div>
      {editingNotes ? <div className="tracker-note-editor"><label className="sr-only" htmlFor={`tracker-note-${record.scholarshipId}`}>Notes for {scholarship?.name || record.scholarshipId}</label><textarea id={`tracker-note-${record.scholarshipId}`} value={notes} maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Add a short note about documents, follow-up, or preparation…" /><div><small>{notes.length}/500 characters. Avoid sensitive personal details.</small><span><Button variant="ghost" size="sm" onClick={cancelNotes}>Cancel</Button><Button size="sm" onClick={saveNotes}>Save note</Button></span></div></div> : <p className={`tracker-note-copy${record.notes ? '' : ' is-empty'}`}>{record.notes || 'No note added yet. Keep a short follow-up or preparation reminder here.'}</p>}
    </section>
    <div className="tracker-record-actions">{detailPath ? <Button as={Link} to={detailPath} variant="secondary" size="sm">View scholarship details</Button> : <span className="tracker-unavailable-note">The original sample listing is no longer available.</span>}<Button variant="ghost" size="sm" className="tracker-delete-action" onClick={() => onRemove(record)}><Trash2 size={14} />Remove application</Button></div>
  </Card>
}
