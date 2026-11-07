import { SearchX } from 'lucide-react'
import EmptyState from '../ui/EmptyState.jsx'

export default function ScholarshipEmptyState({ hasQuery, onClear }) {
  return <div className="scholarship-empty-card">
    <EmptyState icon={SearchX} title={hasQuery ? 'No scholarships match this search' : 'No scholarships match these filters'} description={hasQuery ? 'Try a broader keyword or clear a filter to see more fictional demo opportunities.' : 'Try removing one or more filters, or start fresh to see all demo opportunities.'} action={<button type="button" className="button button-primary button-md" onClick={onClear}>{hasQuery ? 'Clear search and filters' : 'Clear all filters'}</button>} />
    {hasQuery && <p className="empty-search-hint">Try searching for a field such as “engineering”, a category like “Research”, or an award provider.</p>}
  </div>
}
