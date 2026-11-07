export default function Avatar({ name = 'Student', size = 'md', className = '' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return <span className={`avatar avatar-${size} ${className}`} aria-label={name} role="img">{initials}</span>
}
