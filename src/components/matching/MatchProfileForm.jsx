import { useId } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, CircleHelp, UserRound } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import { ROUTES } from '../../utils/constants.js'
import { isMatchingProfileFieldComplete } from '../../utils/scholarshipMatching.js'

const FIELD_META = {
  educationLevel: 'Education level',
  fieldOfStudy: 'Course / field of study',
  academicPercentage: 'Academic percentage',
  annualFamilyIncome: 'Annual family income',
  studyLocation: 'Intended study location',
}

export default function MatchProfileForm({ profile, requiredFields, onChange, saveError = false }) {
  const id = useId()
  const missing = requiredFields.filter((key) => !isMatchingProfileFieldComplete(key, profile[key]))
  const completion = requiredFields.length ? Math.round(((requiredFields.length - missing.length) / requiredFields.length) * 100) : 100
  const patch = (key, value) => onChange({ [key]: value })
  return <Card className="match-profile-card" id="matching-profile">
    <div className="match-profile-heading"><span className="match-profile-icon"><UserRound size={17} /></span><div><h2>Your matching profile</h2><p>Only matching-related details are used. Changes save locally and refresh these results right away.</p></div><span className="profile-completion-pill">{completion}% complete</span></div>
    <div className="profile-progress-track" role="progressbar" aria-label="Matching profile completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completion}><span style={{ width: `${completion}%` }} /></div>
    <div className="match-profile-fields">
      <label htmlFor={`${id}-education`}>{FIELD_META.educationLevel}<span className="field-required-mark">Required</span><select id={`${id}-education`} value={profile.educationLevel} onChange={(event) => patch('educationLevel', event.target.value)}><option value="">Select education level</option>{['Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral'].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label htmlFor={`${id}-field`}>{FIELD_META.fieldOfStudy}<span className="field-required-mark">Required</span><input id={`${id}-field`} type="text" value={profile.fieldOfStudy} onChange={(event) => patch('fieldOfStudy', event.target.value)} placeholder="e.g., Engineering, Commerce, Research" autoComplete="off" /></label>
      {requiredFields.includes('studyLocation') && <label htmlFor={`${id}-location`}>{FIELD_META.studyLocation}<span className="field-context-mark">Needed for some listings</span><select id={`${id}-location`} value={profile.studyLocation} onChange={(event) => patch('studyLocation', event.target.value)}><option value="">Select location</option><option value="India">India</option><option value="Outside India">Outside India</option></select></label>}
      {requiredFields.includes('academicPercentage') && <label htmlFor={`${id}-percentage`}>{FIELD_META.academicPercentage}<span className="field-context-mark">Needed where a minimum applies</span><input id={`${id}-percentage`} type="number" min="0" max="100" step="0.1" inputMode="decimal" value={profile.academicPercentage} onChange={(event) => patch('academicPercentage', event.target.value)} placeholder="e.g., 82.5" /></label>}
      {requiredFields.includes('annualFamilyIncome') && <label htmlFor={`${id}-income`}>{FIELD_META.annualFamilyIncome}<span className="field-context-mark">Needed for need-based criteria</span><input id={`${id}-income`} type="number" min="0" step="1000" inputMode="numeric" value={profile.annualFamilyIncome} onChange={(event) => patch('annualFamilyIncome', event.target.value)} placeholder="Annual amount in ₹" /></label>}
    </div>
    {missing.length > 0 && <div className="missing-profile-fields"><CircleHelp size={15} /><span>Still needed to compare all applicable criteria: {missing.map((key) => FIELD_META[key]).join(', ')}.</span></div>}
    {saveError && <p className="profile-save-error" role="alert">Your browser could not save these profile changes. Check local storage permissions.</p>}
    <div className="match-profile-footer"><p><CheckCircle2 size={14} />Your existing profile details and unrelated saved data are preserved.</p><div><a className="complete-profile-link" href="#matching-profile">{missing.length ? 'Complete profile here' : 'Edit matching details'}</a><Link className="profile-route-link" to={ROUTES.profile}>Open profile <ArrowUpRight size={13} /></Link></div></div>
  </Card>
}
