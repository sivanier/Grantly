import { readLocalStorage } from './localStorage.js'
import { writeLocalStorage } from './localStorage.js'
import { STORAGE_KEYS } from './constants.js'

export const STUDENT_PROFILE_UPDATED_EVENT = 'grantly:profile-updated'

export function readStudentProfile() {
  const profile = readLocalStorage(STORAGE_KEYS.profile, {})
  return profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : {}
}

export function getStoredStudentName(profile = readStudentProfile()) {
  if (Object.prototype.hasOwnProperty.call(profile, 'name')) return typeof profile.name === 'string' ? profile.name.trim() : ''
  const candidates = [profile?.fullName, profile?.firstName, profile?.student?.name, profile?.student?.fullName, profile?.student?.firstName]
  const value = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim())
  return value?.trim() || ''
}

export function getStudentDisplayName() {
  return getStoredStudentName() || 'Student'
}

export function writeStudentProfile(profile) {
  const safeProfile = profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : {}
  const saved = writeLocalStorage(STORAGE_KEYS.profile, safeProfile)
  if (saved && typeof window !== 'undefined') window.dispatchEvent(new Event(STUDENT_PROFILE_UPDATED_EVENT))
  return saved
}

function removeNestedFields(profile, parentKey, fields) {
  const parent = profile[parentKey]
  if (!parent || typeof parent !== 'object' || Array.isArray(parent)) return
  const next = { ...parent }
  fields.forEach((field) => delete next[field])
  if (Object.keys(next).length) profile[parentKey] = next
  else delete profile[parentKey]
}

export function clearStudentProfileFields(profile = readStudentProfile()) {
  const next = { ...profile }
  ;['name', 'fullName', 'firstName', 'educationLevel', 'studyLevel', 'fieldOfStudy', 'course', 'studyLocation', 'academicPercentage', 'percentage', 'annualFamilyIncome', 'familyIncome'].forEach((field) => delete next[field])
  removeNestedFields(next, 'student', ['name', 'fullName', 'firstName'])
  removeNestedFields(next, 'education', ['level'])
  removeNestedFields(next, 'academic', ['fieldOfStudy', 'percentage'])
  removeNestedFields(next, 'financial', ['annualFamilyIncome'])
  return next
}

export function getStudentFirstName() {
  return getStudentDisplayName().split(/\s+/)[0]
}
