function dateFromToday(daysFromNow) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + daysFromNow)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function addedOn(daysAgo) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Fictional records for product demonstration. Providers and programs below are invented.
export const DEMO_SCHOLARSHIPS = [
  {
    id: 'aarohan-future-makers',
    name: 'Future Makers Learning Grant',
    provider: 'Aarohan Learning Collective',
    awardAmount: 100000,
    description: 'A flexible learning grant created to help students continue their undergraduate studies.',
    eligibility: 'Undergraduate students with a family income below ₹6 lakh per year.',
    educationLevels: ['Undergraduate'],
    fieldsOfStudy: ['Arts', 'Commerce', 'Science', 'Technology'],
    courses: ['Bachelor degree', 'Undergraduate studies'],
    eligibilityTypes: ['Need-based'],
    deadline: dateFromToday(6),
    category: 'Need-based',
    matchScore: 96,
    addedAt: addedOn(2),
  },
  {
    id: 'navira-merit-award',
    name: 'Navira Academic Excellence Award',
    provider: 'Navira Education Foundation',
    awardAmount: 70000,
    description: 'Recognition support for students building a strong academic record in higher education.',
    eligibility: 'First or second-year students with a strong academic record.',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    fieldsOfStudy: ['Arts', 'Commerce', 'Science', 'Engineering'],
    courses: ['Bachelor degree', 'Master degree'],
    eligibilityTypes: ['Merit-based'],
    deadline: dateFromToday(14),
    category: 'Merit-based',
    matchScore: 91,
    addedAt: addedOn(5),
  },
  {
    id: 'blue-peepal-research',
    name: 'Blue Peepal Research Fellowship',
    provider: 'Blue Peepal Initiative',
    awardAmount: 50000,
    description: 'A small project award for curious undergraduate researchers working with a faculty mentor.',
    eligibility: 'Undergraduate learners pursuing a supervised research project.',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Doctoral'],
    fieldsOfStudy: ['Research', 'Science', 'Social sciences'],
    courses: ['Research project', 'Thesis'],
    eligibilityTypes: ['Course-specific', 'Merit-based'],
    deadline: dateFromToday(27),
    category: 'Research',
    matchScore: 87,
    addedAt: addedOn(1),
  },
  {
    id: 'sutradhar-women-in-tech',
    name: 'Sutradhar Women in Technology Grant',
    provider: 'Sutradhar Futures Trust',
    awardAmount: 30000,
    description: 'Support for women developing skills and careers in technology and engineering.',
    eligibility: 'Women enrolled in a recognized technology or engineering degree.',
    educationLevels: ['Undergraduate', 'Postgraduate', 'Diploma'],
    fieldsOfStudy: ['Technology', 'Engineering', 'Computer science'],
    courses: ['Computer science', 'Engineering', 'Information technology'],
    eligibilityTypes: ['Course-specific'],
    deadline: dateFromToday(42),
    category: 'Private',
    matchScore: 82,
    addedAt: addedOn(8),
  },
]

const ADDITIONAL_DEMO_SCHOLARSHIPS = [
  {
    id: 'kaveri-civic-futures', name: 'Civic Futures Higher Study Grant', provider: 'Kaveri Learning Circle', awardAmount: 85000,
    description: 'A fictional public-interest education award for students continuing their studies in India.',
    eligibility: 'Undergraduate and postgraduate students with a record of community participation.',
    educationLevels: ['Undergraduate', 'Postgraduate'], fieldsOfStudy: ['Public policy', 'Social sciences', 'Education'],
    courses: ['Public policy', 'Education', 'Social work'], eligibilityTypes: ['Open to all', 'Course-specific'],
    deadline: dateFromToday(19), category: 'Government', addedAt: addedOn(7),
  },
  {
    id: 'atlas-bridge-global', name: 'Atlas Bridge Global Learning Award', provider: 'Atlas Bridge Scholars Network', awardAmount: 150000,
    description: 'A fictional mobility award for learners pursuing an international postgraduate program.',
    eligibility: 'Postgraduate students with an offer for a full-time program outside their home country.',
    educationLevels: ['Postgraduate', 'Doctoral'], fieldsOfStudy: ['International studies', 'Business', 'Public health'],
    courses: ['Master degree', 'International study', 'Doctoral program'], eligibilityTypes: ['Merit-based', 'Course-specific'],
    deadline: dateFromToday(9), category: 'International', addedAt: addedOn(3),
  },
  {
    id: 'mitti-path-diploma-access', name: 'Mitti Path Diploma Access Fund', provider: 'Mitti Path Education Studio', awardAmount: 8000,
    description: 'A modest fee-support award for students beginning a practical diploma course.',
    eligibility: 'Diploma students who can demonstrate financial need.',
    educationLevels: ['Diploma'], fieldsOfStudy: ['Design', 'Skilled trades', 'Technology'],
    courses: ['Diploma', 'Technical training'], eligibilityTypes: ['Need-based', 'Course-specific'],
    deadline: dateFromToday(4), category: 'Private', addedAt: addedOn(0),
  },
  {
    id: 'solstice-mobility-fellowship', name: 'Solstice Scholar Mobility Fellowship', provider: 'Solstice Learning Exchange', awardAmount: 125000,
    description: 'A fictional travel and study award for graduate learners in climate-focused fields.',
    eligibility: 'Postgraduate students in environmental studies or climate research.',
    educationLevels: ['Postgraduate', 'Doctoral'], fieldsOfStudy: ['Environmental studies', 'Climate research'],
    courses: ['Environmental science', 'Climate research'], eligibilityTypes: ['Course-specific'],
    deadline: dateFromToday(31), category: 'International', addedAt: addedOn(11),
  },
  {
    id: 'anvika-doctoral-research', name: 'Anvika Doctoral Research Award', provider: 'Anvika Research Guild', awardAmount: 200000,
    description: 'A fictional research award for doctoral candidates advancing a clearly scoped research proposal.',
    eligibility: 'Doctoral researchers with an approved supervisor and research plan.',
    educationLevels: ['Doctoral'], fieldsOfStudy: ['Research', 'Science', 'Humanities'],
    courses: ['PhD', 'Doctoral research'], eligibilityTypes: ['Merit-based', 'Course-specific'],
    deadline: dateFromToday(58), category: 'Research', addedAt: addedOn(15),
  },
  {
    id: 'koral-first-generation', name: 'Koral First-Generation Learner Grant', provider: 'Koral Student Futures Collective', awardAmount: 45000,
    description: 'A fictional need-focused grant for first-generation learners starting an undergraduate degree.',
    eligibility: 'First-generation undergraduate students with demonstrated financial need.',
    educationLevels: ['Undergraduate'], fieldsOfStudy: ['Arts', 'Commerce', 'Science', 'Technology'],
    courses: ['Bachelor degree', 'Undergraduate studies'], eligibilityTypes: ['Need-based'],
    deadline: dateFromToday(24), category: 'Government', addedAt: addedOn(0),
  },
]

// Search results use the same fictional demo records as the dashboard, plus six more examples.
export const SCHOLARSHIP_LISTINGS = [...DEMO_SCHOLARSHIPS, ...ADDITIONAL_DEMO_SCHOLARSHIPS]

// Additional detail-page data is illustrative and belongs to the same demo records above.
// These criteria are not verified requirements for any real scholarship.
const detailProfiles = {
  'aarohan-future-makers': { minimumPercentage: 60, incomeLimit: 600000, location: 'Open across India', duration: 'One academic year', frequency: 'Annual', awardsAvailable: 20, conditions: ['Currently enrolled in an undergraduate program', 'Demonstrated financial need'] },
  'navira-merit-award': { minimumPercentage: 75, incomeLimit: null, location: 'Open across India', duration: 'One academic year', frequency: 'One-time award', awardsAvailable: 12, conditions: ['First or second year of study', 'Strong academic record'] },
  'blue-peepal-research': { minimumPercentage: 65, incomeLimit: null, location: 'Open across India', duration: 'Up to 6 months', frequency: 'Project-based', awardsAvailable: 8, conditions: ['Supervised project proposal required'] },
  'sutradhar-women-in-tech': { minimumPercentage: 60, incomeLimit: null, location: 'Open across India', duration: 'One academic year', frequency: 'Annual', awardsAvailable: 15, conditions: ['Women applicants only', 'Enrolled in a technology or engineering program'] },
  'kaveri-civic-futures': { minimumPercentage: null, incomeLimit: null, location: 'Open across India', duration: 'One academic year', frequency: 'One-time award', awardsAvailable: 10, conditions: ['Community participation experience'] },
  'atlas-bridge-global': { minimumPercentage: 70, incomeLimit: null, location: 'For study outside India', duration: 'One academic year', frequency: 'Annual', awardsAvailable: 6, conditions: ['Full-time postgraduate offer required'] },
  'mitti-path-diploma-access': { minimumPercentage: null, incomeLimit: 400000, location: 'Open across India', duration: 'One academic year', frequency: 'One-time award', awardsAvailable: 30, conditions: ['Enrolled in a diploma program', 'Demonstrated financial need'] },
  'solstice-mobility-fellowship': { minimumPercentage: 65, incomeLimit: null, location: 'Open across India', duration: 'Up to 4 months', frequency: 'One-time award', awardsAvailable: 5, conditions: ['Climate-focused study plan required'] },
  'anvika-doctoral-research': { minimumPercentage: 70, incomeLimit: null, location: 'Open across India', duration: 'One academic year', frequency: 'Annual', awardsAvailable: 4, conditions: ['Approved supervisor and research plan required'] },
  'koral-first-generation': { minimumPercentage: null, incomeLimit: 500000, location: 'Open across India', duration: 'One academic year', frequency: 'Annual', awardsAvailable: 18, conditions: ['First-generation undergraduate learner', 'Demonstrated financial need'] },
}
export const SCHOLARSHIP_DOCUMENTS = [
  { id: 'marksheets', label: 'Academic mark sheets', icon: 'graduation' },
  { id: 'identity', label: 'Identity proof', icon: 'id' },
  { id: 'income', label: 'Income certificate', icon: 'income' },
  { id: 'bonafide', label: 'Bonafide certificate', icon: 'school' },
  { id: 'bank', label: 'Bank account details', icon: 'bank' },
  { id: 'photo', label: 'Passport-size photograph', icon: 'photo' },
]
export const SCHOLARSHIP_LISTINGS_WITH_DETAILS = SCHOLARSHIP_LISTINGS.map((item) => ({
  ...item,
  duration: detailProfiles[item.id].duration,
  awardFrequency: detailProfiles[item.id].frequency,
  awardsAvailable: detailProfiles[item.id].awardsAvailable,
  criteria: { ...detailProfiles[item.id], education: item.educationLevels, fields: item.fieldsOfStudy },
}))
export const SCHOLARSHIPS_BY_ID = Object.fromEntries(SCHOLARSHIP_LISTINGS_WITH_DETAILS.map((item) => [item.id, item]))

export const DEMO_DEADLINES = DEMO_SCHOLARSHIPS
  .map(({ id, name, deadline }) => ({ id, name, deadline }))
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 3)

export const DEMO_CATEGORY_DISTRIBUTION = [
  { name: 'Merit-based', value: 4, color: '#5965E9' },
  { name: 'Need-based', value: 3, color: '#16A36A' },
  { name: 'Government', value: 2, color: '#93A0FF' },
  { name: 'Private', value: 2, color: '#E9A23B' },
  { name: 'Research', value: 1, color: '#78BDA7' },
]

export const DEMO_ACTIVITY = [
  { id: 'activity-application', label: 'Application marked as submitted', detail: 'Future Leaders Tuition Grant', time: 'Example · 2 days ago', kind: 'submitted' },
  { id: 'activity-saved', label: 'Scholarship saved', detail: 'Navira Academic Excellence Award', time: 'Example · 4 days ago', kind: 'saved' },
  { id: 'activity-profile', label: 'Profile details updated', detail: 'Academic interests and study level', time: 'Example · 1 week ago', kind: 'profile' },
  { id: 'activity-match', label: 'Eligibility assessment completed', detail: 'A sample match summary is ready', time: 'Example · 1 week ago', kind: 'assessment' },
]

export const DEMO_STATISTICS = [
  { label: 'Scholarships matched', value: '12', detail: 'Illustrative demo count', iconName: 'match', tone: 'indigo' },
  { label: 'Saved scholarships', value: '5', detail: 'Illustrative demo count', iconName: 'saved', tone: 'emerald' },
  { label: 'Applications submitted', value: '3', detail: 'Illustrative demo count', iconName: 'submitted', tone: 'warning' },
  { label: 'Upcoming deadlines', value: '2', detail: 'Next 14 days · demo', iconName: 'deadline', tone: 'indigo' },
]
