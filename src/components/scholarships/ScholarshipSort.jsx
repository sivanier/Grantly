import { ArrowDownUp } from 'lucide-react'
import { SORT_OPTIONS } from '../../utils/scholarshipSearch.js'

export default function ScholarshipSort({ value, onChange }) {
  return <label className="scholarship-sort"><ArrowDownUp size={15} aria-hidden="true" /><span className="sort-label">Sort by</span><select aria-label="Sort scholarships" value={value} onChange={(event) => onChange(event.target.value)}>
    {SORT_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
  </select></label>
}
