import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, BookOpen, Check, CircleUserRound, GraduationCap, IndianRupee, MapPin, RotateCcw, Save, ShieldCheck, UserRound } from 'lucide-react'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { SCHOLARSHIP_LISTINGS_WITH_DETAILS } from '../data/scholarships.js'
import { getRequiredProfileFields, isMatchingProfileFieldComplete, normalizeMatchingProfile } from '../utils/scholarshipMatching.js'
import { clearStudentProfileFields, getStoredStudentName, readStudentProfile, writeStudentProfile } from '../utils/studentProfile.js'
import { ROUTES } from '../utils/constants.js'

const PROFILE_FIELDS = getRequiredProfileFields(SCHOLARSHIP_LISTINGS_WITH_DETAILS)
const FIELD_LABELS = {
  educationLevel: 'Education level',
  fieldOfStudy: 'Course or field of study',
  academicPercentage: 'Academic percentage',
  annualFamilyIncome: 'Annual family income',
  studyLocation: 'Study location',
}
const EDUCATION_LEVELS = ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral']

function makeDraft(profile) {
  return { name: getStoredStudentName(profile), ...normalizeMatchingProfile(profile) }
}

function displayValue(value, suffix = '') {
  if (value === '' || value === null || value === undefined) return 'Not provided'
  return `${value}${suffix}`
}

export default function ProfilePage() {
  const [storedProfile, setStoredProfile] = useState(() => readStudentProfile())
  const [draft, setDraft] = useState(() => makeDraft(readStudentProfile()))
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [storageError, setStorageError] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const resetDialogRef = useRef(null)

  useEffect(() => {
    const dialog = resetDialogRef.current
    if (resetOpen && dialog && !dialog.open) dialog.showModal()
    if (!resetOpen && dialog?.open) dialog.close()
  }, [resetOpen])

  const missingFields = useMemo(() => PROFILE_FIELDS.filter((key) => !isMatchingProfileFieldComplete(key, draft[key])), [draft])
  const completion = PROFILE_FIELDS.length ? Math.round(((PROFILE_FIELDS.length - missingFields.length) / PROFILE_FIELDS.length) * 100) : 100
  const name = draft.name.trim()

  const patch = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setMessage('')
  }

  const cancel = () => {
    const latest = readStudentProfile()
    setStoredProfile(latest)
    setDraft(makeDraft(latest))
    setErrors({})
    setMessage('')
    setStorageError('')
    setEditing(false)
  }

  const validate = () => {
    const nextErrors = {}
    if (draft.academicPercentage !== '' && (!Number.isFinite(Number(draft.academicPercentage)) || Number(draft.academicPercentage) < 0 || Number(draft.academicPercentage) > 100)) {
      nextErrors.academicPercentage = 'Enter a percentage from 0 to 100.'
    }
    if (draft.annualFamilyIncome !== '' && (!Number.isFinite(Number(draft.annualFamilyIncome)) || Number(draft.annualFamilyIncome) < 0)) {
      nextErrors.annualFamilyIncome = 'Enter a non-negative annual income.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const save = (event) => {
    event.preventDefault()
    setMessage('')
    if (!validate()) return
    const current = readStudentProfile()
    const next = {
      ...current,
      name: draft.name.trim(),
      educationLevel: draft.educationLevel,
      fieldOfStudy: draft.fieldOfStudy.trim(),
      studyLocation: draft.studyLocation.trim(),
      academicPercentage: draft.academicPercentage === '' ? '' : Number(draft.academicPercentage),
      annualFamilyIncome: draft.annualFamilyIncome === '' ? '' : Number(draft.annualFamilyIncome),
    }
    if (!writeStudentProfile(next)) {
      setStorageError('Your changes could not be saved in this browser. Please check local storage availability and try again.')
      return
    }
    setStoredProfile(next)
    setDraft(makeDraft(next))
    setStorageError('')
    setEditing(false)
    setMessage('Profile changes saved on this device.')
  }

  const reset = () => {
    const cleared = clearStudentProfileFields(readStudentProfile())
    if (!writeStudentProfile(cleared)) {
      setStorageError('Profile details could not be reset. Please try again.')
      setResetOpen(false)
      return
    }
    setStoredProfile(cleared)
    setDraft(makeDraft(cleared))
    setErrors({})
    setStorageError('')
    setEditing(false)
    setResetOpen(false)
    setMessage('Profile details have been reset on this device.')
  }

  const inputProps = (field) => ({ id: `profile-${field}`, value: draft[field], onChange: (event) => patch(field, event.target.value), 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `profile-${field}-error` : undefined })
  const profileHasData = Object.values(makeDraft(storedProfile)).some((value) => String(value ?? '').trim() !== '')

  return <PageContainer className="student-profile-page">
    <PageHeader eyebrow="Your account" title="Student profile" description="Keep the academic details that help GRANTLY compare scholarships accurate and up to date." action={editing ? null : <Button variant="primary" onClick={() => { setDraft(makeDraft(storedProfile)); setEditing(true); setMessage('') }}><UserRound size={15} />Edit profile</Button>} />

    <div className="profile-local-note" role="note"><ShieldCheck size={17} /><p>Your profile is stored locally in this browser for this frontend demonstration. Do not enter sensitive identity or banking information.</p></div>
    {message && <p className="profile-feedback" role="status"><Check size={15} />{message}</p>}
    {storageError && <p className="profile-form-error" role="alert"><AlertCircle size={15} />{storageError}</p>}

    <div className="profile-page-grid">
      <div className="profile-main-column">
        <Card className="profile-overview-card">
          <div className="profile-identity"><Avatar name={name || 'Student'} size="lg" /><div><p className="page-eyebrow">Student account</p><h2>{name || 'Your name'}</h2><p>{draft.educationLevel || 'Education level not provided'}{draft.fieldOfStudy ? ` · ${draft.fieldOfStudy}` : ''}</p></div></div>
          <Badge tone={profileHasData ? 'success' : 'neutral'}>{profileHasData ? 'Profile in progress' : 'Profile not started'}</Badge>
        </Card>

        {editing ? <form className="profile-edit-form" onSubmit={save} noValidate>
          <Card className="profile-form-section"><div className="profile-section-title"><span className="profile-section-icon indigo"><CircleUserRound size={17} /></span><div><h2>About you</h2><p>Basic details for a personalized experience.</p></div></div>
            <div className="profile-form-grid"><label className="profile-field" htmlFor="profile-name">Student name<input id="profile-name" autoComplete="name" value={draft.name} onChange={(event) => patch('name', event.target.value)} placeholder="Enter your name" /></label></div>
          </Card>
          <Card className="profile-form-section"><div className="profile-section-title"><span className="profile-section-icon blue"><GraduationCap size={18} /></span><div><h2>Academic information</h2><p>Used to compare education and course requirements.</p></div></div>
            <div className="profile-form-grid"><label className="profile-field" htmlFor="profile-educationLevel">Education level<select {...inputProps('educationLevel')}><option value="">Select education level</option>{EDUCATION_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
              <label className="profile-field" htmlFor="profile-fieldOfStudy">Course / stream<input {...inputProps('fieldOfStudy')} placeholder="e.g. Commerce, Engineering" /></label>
              <label className="profile-field" htmlFor="profile-academicPercentage">Academic percentage <span className="profile-optional">Optional</span><div className="profile-input-suffix"><input {...inputProps('academicPercentage')} type="number" min="0" max="100" step="any" inputMode="decimal" placeholder="e.g. 82" /><span>%</span></div>{errors.academicPercentage && <small className="profile-inline-error" id="profile-academicPercentage-error">{errors.academicPercentage}</small>}</label>
            </div>
          </Card>
          <Card className="profile-form-section"><div className="profile-section-title"><span className="profile-section-icon green"><IndianRupee size={17} /></span><div><h2>Scholarship eligibility</h2><p>Only used when a sample scholarship lists a relevant requirement.</p></div></div>
            <div className="profile-form-grid"><label className="profile-field" htmlFor="profile-studyLocation">State or study location <span className="profile-optional">Optional</span><input {...inputProps('studyLocation')} autoComplete="address-level1" placeholder="e.g. Maharashtra or Outside India" /></label>
              <label className="profile-field" htmlFor="profile-annualFamilyIncome">Annual family income <span className="profile-optional">Optional</span><div className="profile-input-suffix"><span>₹</span><input {...inputProps('annualFamilyIncome')} type="number" min="0" step="1" inputMode="numeric" placeholder="Enter annual amount" /></div>{errors.annualFamilyIncome && <small className="profile-inline-error" id="profile-annualFamilyIncome-error">{errors.annualFamilyIncome}</small>}</label>
            </div>
          </Card>
          <div className="profile-form-actions"><Button type="submit"><Save size={15} />Save changes</Button><Button variant="secondary" onClick={cancel}>Cancel</Button><Button variant="ghost" className="profile-reset-button" onClick={() => setResetOpen(true)}><RotateCcw size={14} />Reset profile</Button></div>
        </form> : <>
          <Card className="profile-info-section"><div className="profile-section-title"><span className="profile-section-icon blue"><GraduationCap size={18} /></span><div><h2>Academic information</h2><p>Your current area and level of study.</p></div></div><div className="profile-info-grid"><ProfileInfo icon={BookOpen} label="Education level" value={draft.educationLevel} /><ProfileInfo icon={GraduationCap} label="Course / stream" value={draft.fieldOfStudy} /><ProfileInfo icon={Check} label="Academic percentage" value={displayValue(draft.academicPercentage, '%')} /></div></Card>
          <Card className="profile-info-section"><div className="profile-section-title"><span className="profile-section-icon green"><ShieldCheck size={17} /></span><div><h2>Scholarship eligibility</h2><p>Optional details are used only where a listing has a relevant criterion.</p></div></div><div className="profile-info-grid"><ProfileInfo icon={MapPin} label="State or study location" value={draft.studyLocation} /><ProfileInfo icon={IndianRupee} label="Annual family income" value={draft.annualFamilyIncome === '' ? 'Not provided' : `₹${new Intl.NumberFormat('en-IN').format(Number(draft.annualFamilyIncome))}`} /></div></Card>
          <div className="profile-view-actions"><Button variant="secondary" onClick={() => setResetOpen(true)}><RotateCcw size={14} />Reset profile</Button></div>
        </>}
      </div>

      <aside className="profile-side-column">
        <Card className="profile-completion-card"><div className="profile-completion-heading"><div><p className="page-eyebrow">Matching readiness</p><h2>Profile completion</h2></div><strong>{completion}%</strong></div><div className="profile-progress-track" role="progressbar" aria-label="Profile completion for scholarship matching" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completion}><span style={{ width: `${completion}%` }} /></div><p className="profile-completion-copy">Based on the academic and eligibility details needed to compare the current demo scholarship criteria.</p>
          <div className="profile-missing-list"><h3>{missingFields.length ? 'Still needed for matching' : 'Matching fields provided'}</h3>{missingFields.length ? missingFields.map((field) => <div key={field}><span className="profile-missing-dot" />{FIELD_LABELS[field]}</div>) : <div><Check size={14} />All currently required fields are filled</div>}</div>
          <Button as={Link} to={ROUTES.smartMatch} variant="secondary" className="profile-smart-match-link">Review Smart Match <ArrowRight size={15} /></Button>
        </Card>
        <div className="profile-data-note"><ShieldCheck size={16} /><p><strong>Your details stay in this browser.</strong> This frontend demo does not send profile information to a server.</p></div>
      </aside>
    </div>

    <dialog ref={resetDialogRef} className="tracker-confirm-dialog" aria-labelledby="profile-reset-title" aria-describedby="profile-reset-description" onCancel={(event) => { event.preventDefault(); setResetOpen(false) }}><div className="tracker-confirm-icon"><RotateCcw size={19} /></div><p className="page-eyebrow">Confirm reset</p><h2 id="profile-reset-title">Reset profile details?</h2><p id="profile-reset-description">This clears the profile fields GRANTLY uses for scholarship matching from this browser. Other saved GRANTLY data will be kept.</p><div className="tracker-confirm-actions"><Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button><Button className="tracker-confirm-destructive" onClick={reset}>Reset profile</Button></div></dialog>
  </PageContainer>
}

function ProfileInfo({ icon: Icon, label, value }) {
  return <div className="profile-info-item"><span><Icon size={15} />{label}</span><strong>{value || 'Not provided'}</strong></div>
}
