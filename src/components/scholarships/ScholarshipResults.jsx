import { Search } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import ScholarshipCard from './ScholarshipCard.jsx'
import ScholarshipEmptyState from './ScholarshipEmptyState.jsx'

export default function ScholarshipResults({ results, total, filters, savedIds, onToggleSaved, onClear }) {
  return <div className="scholarship-results">
    <div className="results-heading-row"><SectionHeading title={`${results.length} ${results.length === 1 ? 'scholarship' : 'scholarships'} found`} description={`Showing ${results.length} of ${total} demo opportunities`} /><span className="results-sample-label"><Search size={13} aria-hidden="true" /> Demo listings</span></div>
    {results.length > 0 ? <div className="market-scholarship-grid">{results.map((scholarship) => <ScholarshipCard key={scholarship.id} scholarship={scholarship} isSaved={savedIds.includes(scholarship.id)} onToggleSaved={onToggleSaved} variant="market" />)}</div> : <ScholarshipEmptyState hasQuery={Boolean(filters.query.trim())} onClear={onClear} />}
  </div>
}
