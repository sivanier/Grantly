import { getDaysUntil } from './scholarshipSearch.js'

export const MATCH_STATUS = {
  eligible: 'eligible',
  potential: 'potential',
  insufficient: 'insufficient',
  notEligible: 'notEligible',
}

const clean = (value) => typeof value === 'string' ? value.trim().toLocaleLowerCase() : ''
const isProvided = (value) => value !== undefined && value !== null && String(value).trim() !== ''

export function isMatchingProfileFieldComplete(key, value) {
  if (!isProvided(value)) return false
  if (key === 'academicPercentage') return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100
  if (key === 'annualFamilyIncome') return Number.isFinite(Number(value)) && Number(value) >= 0
  return true
}

/**
 * Deterministic comparison against structured scholarship criteria. Any criterion that
 * cannot be compared is kept visible as missing/needs confirmation, never counted as a pass.
 */
export function matchScholarship(scholarship, profile = {}) {
  const matches = []
  const failures = []
  const missing = []
  let evaluated = 0
  const criteria = scholarship?.criteria

  if (!criteria || typeof criteria !== 'object') {
    return {
      status: MATCH_STATUS.insufficient,
      score: null,
      matches,
      failures,
      missing: ['Structured eligibility criteria are not available for this scholarship listing.'],
      evaluatedCriteria: 0,
    }
  }

  const educationLevels = Array.isArray(criteria.education) ? criteria.education : Array.isArray(scholarship.educationLevels) ? scholarship.educationLevels : []
  if (educationLevels.length) {
    const value = profile.educationLevel
    if (!isProvided(value)) missing.push('Add your education level to compare this requirement.')
    else {
      evaluated += 1
      if (educationLevels.some((level) => clean(level) === clean(value))) matches.push(`Education level matches: ${educationLevels.join(', ')}.`)
      else failures.push(`Your education level (${value}) is outside the listed levels: ${educationLevels.join(', ')}.`)
    }
  } else missing.push('This listing does not specify the eligible education levels.')

  const courseOptions = [
    ...(Array.isArray(criteria.fields) ? criteria.fields : Array.isArray(scholarship.fieldsOfStudy) ? scholarship.fieldsOfStudy : []),
    ...(Array.isArray(scholarship.courses) ? scholarship.courses : []),
  ].filter((value, index, list) => clean(value) && list.findIndex((other) => clean(other) === clean(value)) === index)
  if (courseOptions.length) {
    const value = profile.fieldOfStudy
    if (!isProvided(value)) missing.push('Add your course or field of study to compare this requirement.')
    else {
      evaluated += 1
      if (courseOptions.some((course) => clean(course) === clean(value))) matches.push(`Course or field matches: ${value}.`)
      else failures.push(`Your course / field (${value}) is not listed. Listed examples: ${courseOptions.join(', ')}.`)
    }
  } else missing.push('This listing does not specify eligible courses or fields of study.')

  const minimum = Number(criteria.minimumPercentage)
  if (Number.isFinite(minimum) && minimum > 0) {
    if (!isMatchingProfileFieldComplete('academicPercentage', profile.academicPercentage)) missing.push(`Add a valid academic percentage from 0 to 100 to check the ${minimum}% minimum.`)
    else {
      evaluated += 1
      if (Number(profile.academicPercentage) >= minimum) matches.push(`Academic percentage meets the illustrative ${minimum}% minimum.`)
      else failures.push(`Your academic percentage (${Number(profile.academicPercentage)}%) is below the illustrative ${minimum}% minimum.`)
    }
  }

  const incomeLimit = Number(criteria.incomeLimit)
  if (Number.isFinite(incomeLimit) && incomeLimit > 0) {
    if (!isMatchingProfileFieldComplete('annualFamilyIncome', profile.annualFamilyIncome)) missing.push(`Add a valid annual family income to check the ₹${new Intl.NumberFormat('en-IN').format(incomeLimit)} limit.`)
    else {
      evaluated += 1
      if (Number(profile.annualFamilyIncome) <= incomeLimit) matches.push(`Annual family income is within the illustrative ₹${new Intl.NumberFormat('en-IN').format(incomeLimit)} limit.`)
      else failures.push(`Annual family income is above the illustrative ₹${new Intl.NumberFormat('en-IN').format(incomeLimit)} limit.`)
    }
  }

  const locationRequirement = clean(criteria.location)
  if (locationRequirement && !locationRequirement.includes('open across india')) {
    const location = profile.studyLocation
    if (!isProvided(location)) missing.push(`Confirm your intended study location for this requirement: ${criteria.location}.`)
    else {
      evaluated += 1
      const outsideIndiaRequired = locationRequirement.includes('outside india') || locationRequirement.includes('outside the home country')
      const studentOutsideIndia = ['outside india', 'international', 'abroad'].includes(clean(location))
      const passes = outsideIndiaRequired ? studentOutsideIndia : clean(location) === locationRequirement
      if (passes) matches.push(`Study location aligns with the listing: ${criteria.location}.`)
      else failures.push(`Your study location (${location}) does not match the listing: ${criteria.location}.`)
    }
  }

  if (Array.isArray(criteria.conditions)) {
    criteria.conditions.forEach((condition) => missing.push(`Confirm with the provider: ${condition}.`))
  } else {
    missing.push('Additional eligibility conditions are not structured in this listing; confirm them with the provider.')
  }

  const score = evaluated > 0 ? Math.round((matches.length / evaluated) * 100) : null
  const hasFailure = failures.length > 0
  const status = hasFailure
    ? MATCH_STATUS.notEligible
    : evaluated === 0
      ? MATCH_STATUS.insufficient
      : missing.length > 0
        ? MATCH_STATUS.potential
        : MATCH_STATUS.eligible

  return { status, score, matches, failures, missing, evaluatedCriteria: evaluated }
}

const statusRank = { [MATCH_STATUS.eligible]: 0, [MATCH_STATUS.potential]: 1, [MATCH_STATUS.insufficient]: 2, [MATCH_STATUS.notEligible]: 3 }

export function sortMatchResults(results, sortBy = 'best') {
  return [...results].sort((a, b) => {
    if (sortBy === 'deadline') return getDaysUntil(a.scholarship.deadline) - getDaysUntil(b.scholarship.deadline)
    if (sortBy === 'award') return b.scholarship.awardAmount - a.scholarship.awardAmount
    return statusRank[a.match.status] - statusRank[b.match.status] || (b.match.score ?? -1) - (a.match.score ?? -1) || getDaysUntil(a.scholarship.deadline) - getDaysUntil(b.scholarship.deadline)
  })
}

export function getRequiredProfileFields(scholarships) {
  const fields = ['educationLevel', 'fieldOfStudy']
  if (scholarships.some((item) => Number(item.criteria?.minimumPercentage) > 0)) fields.push('academicPercentage')
  if (scholarships.some((item) => Number(item.criteria?.incomeLimit) > 0)) fields.push('annualFamilyIncome')
  if (scholarships.some((item) => {
    const location = clean(item.criteria?.location)
    return location && !location.includes('open across india')
  })) fields.push('studyLocation')
  return fields
}

export function normalizeMatchingProfile(profile = {}) {
  const safe = profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : {}
  const own = (key) => Object.prototype.hasOwnProperty.call(safe, key)
  return {
    educationLevel: own('educationLevel') ? safe.educationLevel || '' : safe.studyLevel || safe.education?.level || '',
    fieldOfStudy: own('fieldOfStudy') ? safe.fieldOfStudy || '' : safe.course || safe.academic?.fieldOfStudy || '',
    academicPercentage: own('academicPercentage') ? safe.academicPercentage ?? '' : safe.percentage ?? safe.academic?.percentage ?? '',
    annualFamilyIncome: own('annualFamilyIncome') ? safe.annualFamilyIncome ?? '' : safe.familyIncome ?? safe.financial?.annualFamilyIncome ?? '',
    studyLocation: own('studyLocation') ? safe.studyLocation || '' : '',
  }
}
