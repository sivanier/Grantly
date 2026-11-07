import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageContainer from './PageContainer.jsx'
import PageHeader from './PageHeader.jsx'
import Card from './Card.jsx'
import EmptyState from './EmptyState.jsx'

export default function PagePlaceholder({ eyebrow = 'Your funding journey', icon, title, description, emptyTitle = 'Coming soon', emptyDescription = 'This space is being prepared for your scholarship journey.', actionLabel, actionTo }) {
  const action = actionLabel && actionTo ? <Link className="button button-primary button-md" to={actionTo}>{actionLabel}<ArrowRight size={16} aria-hidden="true" /></Link> : null
  return <PageContainer>
    <PageHeader eyebrow={eyebrow} title={title} description={description} />
    <Card className="page-empty-card"><EmptyState icon={icon} title={emptyTitle} description={emptyDescription} action={action} /></Card>
  </PageContainer>
}
