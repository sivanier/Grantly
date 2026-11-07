import { SCHOLARSHIPS_BY_ID } from '../data/scholarships.js'
import { readLocalStorage, writeLocalStorage } from './localStorage.js'
import { getDemoApplications, getDemoReminders, SCHOLARSHIP_DETAIL_STORAGE, SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT } from './scholarshipDetails.js'
import { SAVED_SCHOLARSHIPS_UPDATED_EVENT, STORAGE_KEYS } from './constants.js'

/** Notification preferences only: { readIds: string[], dismissedIds: string[] }. */
export const NOTIFICATION_STATE_KEY = STORAGE_KEYS.notificationState
export const NOTIFICATION_DATA_UPDATED_EVENT = 'grantly:notification-data-updated'
export const NOTIFICATION_SOURCE_UPDATED_EVENTS = [SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT]

const formatDeadline = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Date not provided'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day))
}
const formatRecordDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date not recorded' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
const getDaysRemaining = (dateString) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return Infinity
  const [year, month, day] = dateString.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / 86400000)
}

export function getNotificationState() {
  const value = readLocalStorage(NOTIFICATION_STATE_KEY, {})
  const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    readIds: Array.isArray(safe.readIds) ? [...new Set(safe.readIds.filter((id) => typeof id === 'string'))] : [],
    dismissedIds: Array.isArray(safe.dismissedIds) ? [...new Set(safe.dismissedIds.filter((id) => typeof id === 'string'))] : [],
  }
}

/** Builds notifications deterministically from local data; it does not write or create source records. */
export function buildNotifications({ includeDismissed = false } = {}) {
  const savedValue = readLocalStorage(STORAGE_KEYS.savedScholarshipIds, [])
  const savedIds = Array.isArray(savedValue) ? [...new Set(savedValue.filter((id) => typeof id === 'string'))] : []
  const reminders = getDemoReminders()
  const applications = getDemoApplications()
  const notifications = []

  savedIds.forEach((id) => {
    const scholarship = SCHOLARSHIPS_BY_ID[id]
    if (!scholarship) return
    const days = getDaysRemaining(scholarship.deadline)
    if (days >= 0 && days <= 7) notifications.push({
      id: `deadline:${id}:${scholarship.deadline}`,
      type: 'deadline',
      title: 'Scholarship deadline approaching',
      description: `${scholarship.name} closes in ${days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'}`}. This is a fictional demo listing.`,
      dateLabel: `Scholarship deadline · ${formatDeadline(scholarship.deadline)}`,
      scholarshipId: id,
      scholarshipName: scholarship.name,
      destination: 'scholarship',
      sortDate: scholarship.deadline,
    })
  })

  Object.entries(reminders).forEach(([id, enabled]) => {
    const scholarship = SCHOLARSHIPS_BY_ID[id]
    if (!enabled || !scholarship) return
    notifications.push({
      id: `reminder:${id}`,
      type: 'reminder',
      title: 'Saved scholarship reminder',
      description: `A local reminder preference is active for ${scholarship.name}. No message is sent.`,
      dateLabel: `Reminder preference · scholarship deadline ${formatDeadline(scholarship.deadline)}`,
      scholarshipId: id,
      scholarshipName: scholarship.name,
      destination: 'scholarship',
      sortDate: scholarship.deadline || '',
    })
  })

  applications.forEach((record) => {
    const scholarship = SCHOLARSHIPS_BY_ID[record.scholarshipId]
    if (!scholarship) return
    const status = typeof record.status === 'string' && record.status.trim() ? record.status.trim() : 'Applied'
    const eventDate = record.statusUpdatedAt || record.createdAt || ''
    const dateIdentity = eventDate || 'undated'
    const statusWasUpdated = Boolean(record.statusUpdatedAt)
    notifications.push({
      id: `application:${record.scholarshipId}:${status}:${dateIdentity}`,
      type: 'application',
      title: `Application status: ${status}`,
      description: statusWasUpdated
        ? `${scholarship.name} was marked ${status} in your local demo tracker.`
        : `${scholarship.name} is recorded as ${status} in your local demo tracker.`,
      dateLabel: `${statusWasUpdated ? 'Status updated' : 'Application added'} · ${formatRecordDate(eventDate)}`,
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      destination: 'tracker',
      sortDate: eventDate,
    })
  })

  const state = getNotificationState()
  const readSet = new Set(state.readIds)
  const dismissedSet = new Set(state.dismissedIds)
  return notifications
    .map((item) => ({ ...item, read: readSet.has(item.id), dismissed: dismissedSet.has(item.id) }))
    .filter((item) => includeDismissed || !item.dismissed)
    .sort((a, b) => String(b.sortDate).localeCompare(String(a.sortDate)) || a.id.localeCompare(b.id))
}

export function updateNotificationState(mutator) {
  const current = getNotificationState()
  const next = mutator(current)
  const saved = writeLocalStorage(NOTIFICATION_STATE_KEY, next)
  if (saved && typeof window !== 'undefined') window.dispatchEvent(new Event(NOTIFICATION_DATA_UPDATED_EVENT))
  return saved
}

export const NOTIFICATION_SOURCE_KEYS = [STORAGE_KEYS.savedScholarshipIds, SCHOLARSHIP_DETAIL_STORAGE.reminders, SCHOLARSHIP_DETAIL_STORAGE.applications]
