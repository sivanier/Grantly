import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DEMO_CATEGORY_DISTRIBUTION } from '../../data/scholarships.js'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: item } = payload[0]
  return <div className="chart-tooltip"><span className="chart-tooltip-dot" style={{ background: item.color }} /><strong>{name}</strong><span>{value} sample matches</span></div>
}

export default function FundingCategoryChart() {
  return <Card className="category-chart-card">
    <SectionHeading title="Funding by category" description="Illustrative distribution · 12 sample matches" />
    <div className="category-chart-layout">
      <div className="category-chart-wrap" role="img" aria-label="Demo scholarship distribution: 4 merit-based, 3 need-based, 2 government, 2 private, and 1 research opportunity">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={DEMO_CATEGORY_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
              {DEMO_CATEGORY_DISTRIBUTION.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CategoryTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-center"><strong>12</strong><span>sample matches</span></div>
      </div>
      <ul className="category-legend">{DEMO_CATEGORY_DISTRIBUTION.map((item) => <li key={item.name}><span className="legend-label"><i style={{ background: item.color }} />{item.name}</span><strong>{item.value}</strong></li>)}</ul>
    </div>
    <p className="chart-disclaimer">Categories and counts are fictional demo data.</p>
  </Card>
}
