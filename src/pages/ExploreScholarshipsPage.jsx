import { useMemo, useState } from 'react'
import { Filter, Landmark, BookmarkCheck, CalendarClock } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { SCHOLARSHIP_LISTINGS } from '../data/scholarships.js'
import useSavedScholarships from '../hooks/useSavedScholarships.js'
import { getActiveFilterCount, getDaysUntil, readScholarshipFilters, filterScholarships, sortScholarships } from '../utils/scholarshipSearch.js'
import PageContainer from '../components/ui/PageContainer.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ScholarshipSearchBar from '../components/scholarships/ScholarshipSearchBar.jsx'
import ScholarshipFilters from '../components/scholarships/ScholarshipFilters.jsx'
import ScholarshipSort from '../components/scholarships/ScholarshipSort.jsx'
import ActiveFilterChips from '../components/scholarships/ActiveFilterChips.jsx'
import ScholarshipResults from '../components/scholarships/ScholarshipResults.jsx'

const FILTER_PARAMS = ['category', 'award', 'min', 'max', 'level', 'eligibility', 'deadline']

export default function ExploreScholarshipsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { savedIds, toggleSaved } = useSavedScholarships()
  const filters = useMemo(() => readScholarshipFilters(searchParams), [searchParams])
  const activeFilterCount = getActiveFilterCount(filters)
  const results = useMemo(() => sortScholarships(filterScholarships(SCHOLARSHIP_LISTINGS, filters), filters.sort), [filters])
  const upcomingDeadlineCount = SCHOLARSHIP_LISTINGS.filter((scholarship) => getDaysUntil(scholarship.deadline) >= 0).length

  function updateParam(key, value, { replace = false } = {}) {
    const next = new URLSearchParams(searchParams)
    if (key === 'categories') {
      next.delete('category')
      value.forEach((category) => next.append('category', category))
    } else if (key === 'award') {
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('min')
      next.delete('max')
    } else if (key === 'min' || key === 'max') {
      next.delete('award')
      if (value === '') next.delete(key)
      else next.set(key, value)
    } else if (key === 'query') {
      if (value === '') next.delete('q')
      else next.set('q', value)
    } else if (key === 'sort') {
      if (!value || value === 'recommended') next.delete('sort')
      else next.set(key, value)
    } else if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace })
  }

  function clearAllFilters() {
    const next = new URLSearchParams(searchParams)
    FILTER_PARAMS.forEach((key) => next.delete(key))
    setSearchParams(next)
  }

  function clearSearchAndFilters() {
    const next = new URLSearchParams(searchParams)
    ;['q', ...FILTER_PARAMS].forEach((key) => next.delete(key))
    setSearchParams(next)
  }

  function removeChip(key, value) {
    if (key === 'category') updateParam('categories', filters.categories.filter((category) => category !== value))
    else if (key === 'amount') {
      const next = new URLSearchParams(searchParams)
      next.delete('award'); next.delete('min'); next.delete('max')
      setSearchParams(next)
    } else updateParam(key, '')
  }

  return <PageContainer className="explore-page">
    <PageHeader eyebrow="Find your opportunity" title="Explore Scholarships" description="Discover funding opportunities that match your academic journey." />

    <section className="market-summary" aria-label="Scholarship marketplace summary">
      <StatCard label="Demo scholarships" value={SCHOLARSHIP_LISTINGS.length} detail="Fictional listings available" icon={Landmark} tone="indigo" />
      <StatCard label="Saved scholarships" value={savedIds.length} detail="Stored on this device" icon={BookmarkCheck} tone="emerald" />
      <StatCard label="Upcoming deadlines" value={upcomingDeadlineCount} detail="Future demo dates" icon={CalendarClock} tone="warning" />
    </section>

    <section className="explore-search-tools" aria-label="Search and sort scholarships">
      <ScholarshipSearchBar value={filters.query} onChange={(value) => updateParam('query', value, { replace: true })} />
      <div className="explore-tool-actions">
        <button type="button" className="mobile-filter-toggle" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} aria-expanded={mobileFiltersOpen} aria-controls="scholarship-filter-panel"><Filter size={16} />Filters{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
        <ScholarshipSort value={filters.sort} onChange={(value) => updateParam('sort', value)} />
      </div>
    </section>

    <div className="explore-layout">
      <div id="scholarship-filter-panel" className="explore-filter-column">
        <ScholarshipFilters filters={filters} onFilterChange={updateParam} onClear={clearAllFilters} activeCount={activeFilterCount} mobileOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />
      </div>
      <section className="explore-results-column" aria-label="Scholarship search results">
        <ActiveFilterChips filters={filters} onRemove={removeChip} />
        <ScholarshipResults results={results} total={SCHOLARSHIP_LISTINGS.length} filters={filters} savedIds={savedIds} onToggleSaved={toggleSaved} onClear={filters.query.trim() ? clearSearchAndFilters : clearAllFilters} />
      </section>
    </div>
  </PageContainer>
}
