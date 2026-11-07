import { Search, X } from 'lucide-react'

export default function ScholarshipSearchBar({ value, onChange }) {
  return <div className="market-search search-input">
    <Search size={19} aria-hidden="true" />
    <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by scholarship, provider, course or keyword" aria-label="Search scholarships" />
    {value && <button type="button" className="search-clear" onClick={() => onChange('')} aria-label="Clear scholarship search"><X size={17} /></button>}
  </div>
}
