import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'
import { getStudentFirstName } from '../../utils/studentProfile.js'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'

export default function WelcomeSection() {
  return <section className="dashboard-welcome" aria-labelledby="welcome-title">
    <div className="welcome-copy">
      <Badge tone="indigo"><Sparkles size={12} aria-hidden="true" /> Your funding journey</Badge>
      <h1 id="welcome-title">Good morning, {getStudentFirstName()}!</h1>
      <p>Your scholarship journey starts here. Let’s make your future brighter.</p>
    </div>
    <Button as={Link} to={ROUTES.explore} size="md" className="welcome-action">Find Scholarships <ArrowRight size={16} aria-hidden="true" /></Button>
    <div className="welcome-decoration" aria-hidden="true"><span className="welcome-orbit orbit-one" /><span className="welcome-orbit orbit-two" /><span className="welcome-star">✦</span></div>
  </section>
}
