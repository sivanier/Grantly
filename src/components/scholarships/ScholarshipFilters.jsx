import { Check, ChevronDown, Filter, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import {
  AWARD_RANGES,
  DEADLINE_OPTIONS,
  EDUCATION_LEVELS,
  ELIGIBILITY_OPTIONS,
  SCHOLARSHIP_CATEGORIES,
} from '../../utils/scholarshipSearch.js'

function FilterGroup({ title, children, className = '' }) {
  return <section className={`filter-group ${className}`}><h3>{title}</h3>{children}</section>
}

function Choice({ name, value, checked, onChange, children, kind = 'radio' }) {
  return <label className={`filter-choice${checked ? ' is-checked' : ''}`}>
    <input type={kind} name={name} value={value} checked={checked} onChange={onChange} />
    <span className="custom-choice" aria-hidden="true">{checked && <Check size={12} strokeWidth={2.5} />}</span>
    <span>{children}</span>
  </label>
}

export default function ScholarshipFilters({ filters, onFilterChange, onClear, activeCount, mobileOpen, onClose }) {
  const [openGroups, setOpenGroups] = useState({ category: true, award: true, level: true, eligibility: true, deadline: true })
  const toggleGroup = (key) => setOpenGroups((current) => ({ ...current, [key]: !current[key] }))
  const setCategory = (category, selected) => {
    const categories = selected ? [...filters.categories, category] : filters.categories.filter((value) => value !== category)
    onFilterChange('categories', categories)
  }

  return <aside className={`scholarship-filter-panel${mobileOpen ? ' is-open' : ''}`} aria-label="Scholarship filters">
    <div className="filter-panel-heading"><div><Filter size={16} /><h2>Filters</h2>{activeCount > 0 && <span className="filter-count">{activeCount}</span>}</div><button type="button" className="filter-mobile-close" onClick={onClose}>Done</button></div>

    <FilterGroup title="Category" className={!openGroups.category ? 'is-collapsed' : ''}>
      <button className="filter-group-toggle" onClick={() => toggleGroup('category')} aria-expanded={openGroups.category} aria-label="Toggle category filters"><ChevronDown size={15} /></button>
      {openGroups.category && <div className="filter-options">{SCHOLARSHIP_CATEGORIES.map((category) => <Choice key={category} name="category" kind="checkbox" value={category} checked={filters.categories.includes(category)} onChange={(event) => setCategory(category, event.target.checked)}>{category}</Choice>)}</div>}
    </FilterGroup>

    <FilterGroup title="Award amount" className={!openGroups.award ? 'is-collapsed' : ''}>
      <button className="filter-group-toggle" onClick={() => toggleGroup('award')} aria-expanded={openGroups.award} aria-label="Toggle award amount filters"><ChevronDown size={15} /></button>
      {openGroups.award && <>
        <div className="filter-options"><Choice name="award" value="" checked={!filters.award && !filters.min && !filters.max} onChange={() => onFilterChange('award', '')}>Any award amount</Choice>{AWARD_RANGES.map((range) => <Choice key={range.value} name="award" value={range.value} checked={filters.award === range.value} onChange={() => onFilterChange('award', range.value)}>{range.label}</Choice>)}</div>
        <div className="custom-range-fields"><label>Min <span className="sr-only">minimum award amount in rupees</span><input aria-label="Minimum award amount in rupees" type="number" min="0" step="1000" inputMode="numeric" placeholder="₹ min" value={filters.min} onChange={(event) => onFilterChange('min', event.target.value)} /></label><span aria-hidden="true">—</span><label>Max <span className="sr-only">maximum award amount in rupees</span><input aria-label="Maximum award amount in rupees" type="number" min="0" step="1000" inputMode="numeric" placeholder="₹ max" value={filters.max} onChange={(event) => onFilterChange('max', event.target.value)} /></label></div>
        {filters.min !== '' && filters.max !== '' && Number(filters.min) > Number(filters.max) && <p className="filter-validation" role="status">Minimum must be less than maximum.</p>}
      </>}
    </FilterGroup>

    <FilterGroup title="Education level" className={!openGroups.level ? 'is-collapsed' : ''}>
      <button className="filter-group-toggle" onClick={() => toggleGroup('level')} aria-expanded={openGroups.level} aria-label="Toggle education filters"><ChevronDown size={15} /></button>
      {openGroups.level && <div className="filter-options"><Choice name="level" value="" checked={!filters.level} onChange={() => onFilterChange('level', '')}>Any level</Choice>{EDUCATION_LEVELS.map((level) => <Choice key={level} name="level" value={level} checked={filters.level === level} onChange={() => onFilterChange('level', level)}>{level}</Choice>)}</div>}
    </FilterGroup>

    <FilterGroup title="Eligibility" className={!openGroups.eligibility ? 'is-collapsed' : ''}>
      <button className="filter-group-toggle" onClick={() => toggleGroup('eligibility')} aria-expanded={openGroups.eligibility} aria-label="Toggle eligibility filters"><ChevronDown size={15} /></button>
      {openGroups.eligibility && <div className="filter-options"><Choice name="eligibility" value="" checked={!filters.eligibility} onChange={() => onFilterChange('eligibility', '')}>Any eligibility</Choice>{ELIGIBILITY_OPTIONS.map((option) => <Choice key={option.value} name="eligibility" value={option.value} checked={filters.eligibility === option.value} onChange={() => onFilterChange('eligibility', option.value)}>{option.label}</Choice>)}</div>}
    </FilterGroup>

    <FilterGroup title="Deadline" className={!openGroups.deadline ? 'is-collapsed' : ''}>
      <button className="filter-group-toggle" onClick={() => toggleGroup('deadline')} aria-expanded={openGroups.deadline} aria-label="Toggle deadline filters"><ChevronDown size={15} /></button>
      {openGroups.deadline && <div className="filter-options"><Choice name="deadline" value="" checked={!filters.deadline} onChange={() => onFilterChange('deadline', '')}>All scholarships</Choice>{DEADLINE_OPTIONS.map((option) => <Choice key={option.value} name="deadline" value={option.value} checked={filters.deadline === option.value} onChange={() => onFilterChange('deadline', option.value)}>{option.label}</Choice>)}</div>}
    </FilterGroup>

    <button type="button" className="clear-filters-button" onClick={onClear} disabled={activeCount === 0}><RotateCcw size={14} />Clear all filters</button>
  </aside>
}
