import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants.js'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">404 · Page not found</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">This page isn’t here.</h1>
        <p className="mt-3 text-slate-600">The link may be outdated, or the page may have moved.</p>
        <Link className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2" to={ROUTES.dashboard}>Back to dashboard</Link>
      </div>
    </main>
  )
}
