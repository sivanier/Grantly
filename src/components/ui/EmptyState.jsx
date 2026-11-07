import { SearchX } from 'lucide-react'

export default function EmptyState({ icon: Icon = SearchX, title, description, action }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span><h2>{title}</h2><p>{description}</p>{action}</div>
}
