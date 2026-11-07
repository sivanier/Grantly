import { useEffect, useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpRight, BadgeCheck, CircleHelp, Filter, Info, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MatchProfileForm from '../components/matching/MatchProfileForm.jsx'
import MatchResultCard from '../components/matching/MatchResultCard.jsx'
import { SCHOLARSHIP_LISTINGS_WITH_DETAILS } from '../data/scholarships.js'
import useSavedScholarships from '../hooks/useSavedScholarships.js'
import { MATCH_STATUS, getRequiredProfileFields, isMatchingProfileFieldComplete, matchScholarship, normalizeMatchingProfile, sortMatchResults } from '../utils/scholarshipMatching.js'
import { readStudentProfile, STUDENT_PROFILE_UPDATED_EVENT, writeStudentProfile } from '../utils/studentProfile.js'
import { ROUTES, STORAGE_KEYS } from '../utils/constants.js'

const RESULT_FILTERS = [
  { value: 'all', label: 'All results' },
  { value: MATCH_STATUS.eligible, label: 'Eligible' },
  { value: MATCH_STATUS.potential, label: 'Potentially eligible' },
  { value: MATCH_STATUS.insufficient, label: 'Not enough information' },
  { value: MATCH_STATUS.notEligible, label: 'Not eligible' },
]
const REQUIRED_FIELDS = getRequiredProfileFields(SCHOLARSHIP_LISTINGS_WITH_DETAILS)
const STATUS_TO_FILTER = { eligible: MATCH_STATUS.eligible, potential: MATCH_STATUS.potential, insufficient: MATCH_STATUS.insufficient, notEligible: MATCH_STATUS.notEligible }

function readProfile() {
  return readStudentProfile()
}

export default function SmartMatchPage() {
  const [profile, setProfile] = useState(() => normalizeMatchingProfile(readProfile()))
  const [saveError, setSaveError] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('best')
  const { savedIds, toggleSaved } = useSavedScholarships()

  useEffect(() => {
    const syncProfile = (event) => {
      if (event.key === STORAGE_KEYS.profile || event.type === 'focus' || event.type === STUDENT_PROFILE_UPDATED_EVENT) setProfile(normalizeMatchingProfile(readProfile()))
    }
    window.addEventListener('storage', syncProfile)
    window.addEventListener('focus', syncProfile)
    window.addEventListener(STUDENT_PROFILE_UPDATED_EVENT, syncProfile)
    return () => {
      window.removeEventListener('storage', syncProfile)
      window.removeEventListener('focus', syncProfile)
      window.removeEventListener(STUDENT_PROFILE_UPDATED_EVENT, syncProfile)
    }
  }, [])

  const requiredMissing = REQUIRED_FIELDS.filter((key) => !isMatchingProfileFieldComplete(key, profile[key]))
  const completion = REQUIRED_FIELDS.length ? Math.round(((REQUIRED_FIELDS.length - requiredMissing.length) / REQUIRED_FIELDS.length) * 100) : 100
  const allResults = useMemo(() => SCHOLARSHIP_LISTINGS_WITH_DETAILS.map((scholarship) => ({ scholarship, match: matchScholarship(scholarship, profile) })), [profile])
  const counts = useMemo(() => RESULT_FILTERS.reduce((acc, filter) => {
    acc[filter.value] = filter.value === 'all' ? allResults.length : allResults.filter(({ match }) => match.status === filter.value).length
    return acc
  }, {}), [allResults])
  const visibleResults = useMemo(() => sortMatchResults(allResults.filter(({ match }) => activeFilter === 'all' || match.status === STATUS_TO_FILTER[activeFilter]), sortBy), [allResults, activeFilter, sortBy])

  const updateProfile = (patch) => {
    const raw = readProfile()
    const nextProfile = { ...raw, ...patch }
    if (writeStudentProfile(nextProfile)) {
      setProfile(normalizeMatchingProfile(nextProfile))
      setSaveError(false)
    } else setSaveError(true)
  }

  return <PageContainer className="smart-match-page">
    <PageHeader eyebrow="A clearer path to funding" title="Smart Scholarship Match" description="Compare your study profile with the criteria in GRANTLY’s sample scholarships, and see what still needs checking." action={<Button as={Link} to={ROUTES.explore} variant="secondary"><Sparkles size={15} />Explore scholarships</Button>} />

    <div className="match-intro-grid">
      <Card className="match-intro-card"><span className="match-intro-icon"><Target size={19} /></span><div><p>Profile completion</p><strong>{completion}%</strong><div className="profile-progress-track" role="progressbar" aria-label="Matching profile completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completion}><span style={{ width: `${completion}%` }} /></div><small>{requiredMissing.length ? `${requiredMissing.length} matching detail${requiredMissing.length === 1 ? '' : 's'} still needed` : 'All matching details are provided'}</small></div><a href="#matching-profile" className="match-intro-link">{requiredMissing.length ? 'Complete profile' : 'Edit profile'}</a></Card>
      <div className="match-method-note"><Info size={16} /><p><strong>Transparent, rule-based comparison.</strong> Results use exact education and course matches plus listed numeric and location requirements. Extra conditions that cannot be checked from your profile are flagged for confirmation.</p></div>
    </div>

    <MatchProfileForm profile={profile} requiredFields={REQUIRED_FIELDS} onChange={updateProfile} saveError={saveError} />

    <section className="match-results-section" aria-labelledby="match-results-title">
      <div className="match-results-heading"><div><p className="page-eyebrow">Your scholarship shortlist</p><h2 id="match-results-title">Match results <span>{visibleResults.length}</span></h2><p>Results update immediately when you change matching details above.</p></div><label className="match-sort-label"><ArrowDownWideNarrow size={15} /><span>Sort</span><select aria-label="Sort scholarship matches" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="best">Best compatibility</option><option value="deadline">Soonest deadline</option><option value="award">Highest award</option></select></label></div>
      <div className="match-filter-row" role="group" aria-label="Filter match results"><span><Filter size={14} />Filter</span>{RESULT_FILTERS.map(({ value, label }) => <button type="button" key={value} className={`match-filter-chip${activeFilter === value ? ' is-active' : ''}`} aria-pressed={activeFilter === value} onClick={() => setActiveFilter(value)}>{label}<span>{counts[value] ?? 0}</span></button>)}</div>

      {SCHOLARSHIP_LISTINGS_WITH_DETAILS.length === 0 ? <Card className="match-empty-card"><EmptyState icon={CircleHelp} title="No sample scholarships yet" description="Once scholarship listings are available, GRANTLY can compare them with your matching profile." action={<Button as={Link} to={ROUTES.explore} variant="secondary">Explore scholarships <ArrowUpRight size={14} /></Button>} /></Card> : visibleResults.length === 0 ? <Card className="match-empty-card"><EmptyState icon={BadgeCheck} title="No scholarships in this group" description="Try another result filter to review your other comparisons." action={<Button variant="secondary" onClick={() => setActiveFilter('all')}>Show all results</Button>} /></Card> : <div className="match-results-grid">{visibleResults.map(({ scholarship, match }) => <MatchResultCard key={scholarship.id} scholarship={scholarship} match={match} isSaved={savedIds.includes(scholarship.id)} onToggleSaved={toggleSaved} />)}</div>}
    </section>

    <div className="matching-disclaimer"><Info size={16} /><p><strong>Indicative matches and fictional examples.</strong> These matches are indicative and based on the information provided. They do not guarantee eligibility or selection. Always verify the latest criteria with the official scholarship provider. All scholarships and providers shown here are fictional demonstration data.</p></div>
  </PageContainer>
}
