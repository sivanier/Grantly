import Card from './Card.jsx'

export default function StatCard({ label, value, detail, icon: Icon, tone = 'indigo' }) {
  return <Card className="stat-card"><div className={`stat-icon stat-icon-${tone}`}><Icon size={20} aria-hidden="true" /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></Card>
}
