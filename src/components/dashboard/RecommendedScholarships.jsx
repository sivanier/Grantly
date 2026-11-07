import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DEMO_SCHOLARSHIPS } from '../../data/scholarships.js'
import { ROUTES } from '../../utils/constants.js'
import SectionHeading from '../ui/SectionHeading.jsx'
import ScholarshipCard from './ScholarshipCard.jsx'

export default function RecommendedScholarships({ savedIds, onToggleSaved }) {
  return <section className="dashboard-section" aria-label="Recommended scholarships">
    <SectionHeading title="Recommended scholarships" description="Fictional opportunities picked to showcase the GRANTLY experience." action={<Link className="section-link" to={ROUTES.explore}>View all <ArrowRight size={15} aria-hidden="true" /></Link>} />
    <div className="scholarship-grid">
      {DEMO_SCHOLARSHIPS.map((scholarship) => <ScholarshipCard key={scholarship.id} scholarship={scholarship} isSaved={savedIds.includes(scholarship.id)} onToggleSaved={onToggleSaved} />)}
    </div>
  </section>
}
