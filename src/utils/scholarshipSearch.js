export const SCHOLARSHIP_CATEGORIES = ['Merit-based', 'Need-based', 'Government', 'Private', 'Research', 'International']
export const EDUCATION_LEVELS = ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral']
export const ELIGIBILITY_OPTIONS = [
  { value: 'Open to all', label: 'Open to all eligible students' },
  { value: 'Need-based', label: 'Need-based' },
  { value: 'Merit-based', label: 'Merit-based' },
  { value: 'Course-specific', label: 'Course-specific' },
]
export const AWARD_RANGES = [
  { value: 'under-10000', label: 'Under ₹10,000' },
  { value: '10000-50000', label: '₹10,000–₹50,000' },
  { value: '50000-100000', label: '₹50,000–₹1,00,000' },
  { value: 'over-100000', label: 'Above ₹1,00,000' },
]
export const DEADLINE_OPTIONS = [
  { value: 'soon', label: 'Closing soon · 7 days' },
  { value: 'month', label: 'Closing this month' },
  { value: 'future', label: 'Future deadlines' },
]
export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'deadline', label: 'Deadline: Soonest first' },
  { value: 'award-high', label: 'Award: Highest first' },
  { value: 'award-low', label: 'Award: Lowest first' },
  { value: 'recent', label: 'Recently added' },
]

export function getDaysUntil(dateString) {
  if (!dateString) return Number.POSITIVE_INFINITY
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((date - today) / 86400000)
}

function isClosingThisMonth(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const deadline = new Date(year, month - 1, day)
  const today = new Date()
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)
  monthEnd.setHours(23, 59, 59, 999)
  return deadline >= today && deadline <= monthEnd
}

export function readScholarshipFilters(params) {
  return {
    query: params.get('q') ?? '',
    categories: params.getAll('category').filter((value) => SCHOLARSHIP_CATEGORIES.includes(value)),
    award: params.get('award') ?? '',
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
    level: EDUCATION_LEVELS.includes(params.get('level')) ? params.get('level') : '',
    eligibility: ELIGIBILITY_OPTIONS.some((option) => option.value === params.get('eligibility')) ? params.get('eligibility') : '',
    deadline: DEADLINE_OPTIONS.some((option) => option.value === params.get('deadline')) ? params.get('deadline') : '',
    sort: SORT_OPTIONS.some((option) => option.value === params.get('sort')) ? params.get('sort') : 'recommended',
  }
}

export function getActiveFilterCount(filters) {
  return filters.categories.length + Number(Boolean(filters.award || filters.min || filters.max)) + Number(Boolean(filters.level)) + Number(Boolean(filters.eligibility)) + Number(Boolean(filters.deadline))
}

function scholarshipSearchText(scholarship) {
  return [
    scholarship.name,
    scholarship.provider,
    scholarship.description,
    scholarship.category,
    scholarship.eligibility,
    scholarship.fieldsOfStudy,
    scholarship.courses,
    scholarship.educationLevels,
    scholarship.eligibilityTypes,
  ].flat().filter(Boolean).join(' ').toLocaleLowerCase()
}

function matchesAwardRange(amount, range) {
  switch (range) {
    case 'under-10000': return amount < 10000
    case '10000-50000': return amount >= 10000 && amount <= 50000
    case '50000-100000': return amount > 50000 && amount <= 100000
    case 'over-100000': return amount > 100000
    default: return true
  }
}

export function filterScholarships(scholarships, filters) {
  const query = filters.query.trim().toLocaleLowerCase()
  const min = filters.min === '' ? null : Number(filters.min)
  const max = filters.max === '' ? null : Number(filters.max)
  return scholarships.filter((scholarship) => {
    if (query && !scholarshipSearchText(scholarship).includes(query)) return false
    if (filters.categories.length && !filters.categories.includes(scholarship.category)) return false
    if (filters.award && !matchesAwardRange(scholarship.awardAmount, filters.award)) return false
    if (min !== null && Number.isFinite(min) && scholarship.awardAmount < min) return false
    if (max !== null && Number.isFinite(max) && scholarship.awardAmount > max) return false
    if (filters.level && !scholarship.educationLevels?.includes(filters.level)) return false
    if (filters.eligibility && !scholarship.eligibilityTypes?.includes(filters.eligibility)) return false
    const days = getDaysUntil(scholarship.deadline)
    if (filters.deadline === 'soon' && (days < 0 || days > 7)) return false
    if (filters.deadline === 'month' && !isClosingThisMonth(scholarship.deadline)) return false
    if (filters.deadline === 'future' && (!scholarship.deadline || days < 0 || isClosingThisMonth(scholarship.deadline))) return false
    return true
  })
}

export function sortScholarships(scholarships, sort = 'recommended') {
  return scholarships.map((item, index) => ({ item, index })).sort((a, b) => {
    if (sort === 'deadline') return getDaysUntil(a.item.deadline) - getDaysUntil(b.item.deadline) || a.index - b.index
    if (sort === 'award-high') return b.item.awardAmount - a.item.awardAmount || a.index - b.index
    if (sort === 'award-low') return a.item.awardAmount - b.item.awardAmount || a.index - b.index
    if (sort === 'recent') return (b.item.addedAt ?? '').localeCompare(a.item.addedAt ?? '') || a.index - b.index
    return a.index - b.index
  }).map(({ item }) => item)
}
