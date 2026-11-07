import { X } from 'lucide-react'
import { AWARD_RANGES, DEADLINE_OPTIONS, ELIGIBILITY_OPTIONS } from '../../utils/scholarshipSearch.js'

export default function ActiveFilterChips({ filters, onRemove }) {
  const chips = [
    ...filters.categories.map((category) => ({ key: `category:${category}`, label: category, remove: () => onRemove('category', category) })),
    ...(filters.award ? [{ key: 'award', label: AWARD_RANGES.find((range) => range.value === filters.award)?.label ?? 'Award range', remove: () => onRemove('award') }] : []),
    ...(!filters.award && (filters.min || filters.max) ? [{ key: 'custom-amount', label: `${filters.min ? `₹${Number(filters.min).toLocaleString('en-IN')}` : 'Any'} – ${filters.max ? `₹${Number(filters.max).toLocaleString('en-IN')}` : 'Any'}`, remove: () => onRemove('amount') }] : []),
    ...(filters.level ? [{ key: 'level', label: filters.level, remove: () => onRemove('level') }] : []),
    ...(filters.eligibility ? [{ key: 'eligibility', label: ELIGIBILITY_OPTIONS.find((option) => option.value === filters.eligibility)?.label ?? filters.eligibility, remove: () => onRemove('eligibility') }] : []),
    ...(filters.deadline ? [{ key: 'deadline', label: DEADLINE_OPTIONS.find((option) => option.value === filters.deadline)?.label ?? 'Deadline', remove: () => onRemove('deadline') }] : []),
  ]
  return chips.length > 0 ? <div className="active-filter-chips" aria-label="Active filters">{chips.map((chip) => <button type="button" key={chip.key} className="active-filter-chip" onClick={chip.remove}>{chip.label}<X size={12} aria-hidden="true" /><span className="sr-only">Remove {chip.label} filter</span></button>)}</div> : null
}
