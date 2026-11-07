import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchInput({ className = '', placeholder = 'Search...', onSubmit, ...props }) {
  const [value, setValue] = useState('')
  function handleSubmit(event) {
    if (event.key === 'Enter' && value.trim()) {
      event.preventDefault()
      onSubmit?.(value)
    }
  }
  return <label className={`search-input ${className}`}><Search size={18} aria-hidden="true" /><input type="search" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleSubmit} placeholder={placeholder} {...props} /></label>
}
