import { useEffect, useRef } from 'react'

export default function Dropdown({ open, onClose, children, className = '', role = 'dialog', ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const closeOutside = (event) => { if (ref.current && !ref.current.contains(event.target)) onClose?.() }
    const closeEscape = (event) => { if (event.key === 'Escape') onClose?.() }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape) }
  }, [open, onClose])
  if (!open) return null
  return <div ref={ref} className={`dropdown-panel ${className}`} role={role} {...props}>{children}</div>
}
