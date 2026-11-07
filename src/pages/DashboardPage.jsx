import { CircleAlert } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { DEMO_ACTIVITY } from '../data/scholarships.js'
import useSavedScholarships from '../hooks/useSavedScholarships.js'
import PageContainer from '../components/ui/PageContainer.jsx'
import WelcomeSection from '../components/dashboard/WelcomeSection.jsx'
import DashboardStatGrid from '../components/dashboard/DashboardStatGrid.jsx'
import FundingOverviewCard from '../components/dashboard/FundingOverviewCard.jsx'
import RecommendedScholarships from '../components/dashboard/RecommendedScholarships.jsx'
import DeadlineWidget from '../components/dashboard/DeadlineWidget.jsx'
import ActivityTimeline from '../components/dashboard/ActivityTimeline.jsx'
import QuickActions from '../components/dashboard/QuickActions.jsx'
import SavedScholarshipsPreview from '../components/dashboard/SavedScholarshipsPreview.jsx'

const FundingCategoryChart = lazy(() => import('../components/dashboard/FundingCategoryChart.jsx'))

export default function DashboardPage() {
  const { savedIds, toggleSaved } = useSavedScholarships()
  return <PageContainer className="dashboard-page">
    <WelcomeSection />
    <div className="demo-data-notice" role="note"><CircleAlert size={16} aria-hidden="true" /><p><strong>Demo dashboard.</strong> Metrics, scholarship examples, amounts, match scores, dates, and activity below are illustrative only. Programs and providers are fictional; this is not official funding or verified application history.</p></div>
    <DashboardStatGrid />
    <section className="dashboard-feature-grid" aria-label="Funding overview and category distribution">
      <FundingOverviewCard />
      <Suspense fallback={<div className="category-chart-card card chart-loading" role="status">Loading sample category chart…</div>}><FundingCategoryChart /></Suspense>
    </section>
    <RecommendedScholarships savedIds={savedIds} onToggleSaved={toggleSaved} />
    <section className="dashboard-two-column" aria-label="Deadlines and sample activity">
      <DeadlineWidget />
      <ActivityTimeline activities={DEMO_ACTIVITY} />
    </section>
    <QuickActions />
    <SavedScholarshipsPreview savedIds={savedIds} />
  </PageContainer>
}
