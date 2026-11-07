import { readLocalStorage, writeLocalStorage } from './localStorage.js'

export const SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT = 'grantly:scholarship-local-data-updated'

export const SCHOLARSHIP_DETAIL_STORAGE = {
  documentsPrefix: 'grantly:scholarship-documents:',
  reminders: 'grantly:demo-reminders',
  applications: 'grantly:demo-applications',
}

export function getDocumentProgress(scholarshipId, documentIds) {
  const saved = readLocalStorage(`${SCHOLARSHIP_DETAIL_STORAGE.documentsPrefix}${scholarshipId}`, {})
  return Object.fromEntries(documentIds.map((id) => [id, saved?.[id] === true]))
}

export function saveDocumentProgress(scholarshipId, progress) {
  return writeLocalStorage(`${SCHOLARSHIP_DETAIL_STORAGE.documentsPrefix}${scholarshipId}`, progress)
}

export function getDemoApplications() {
  const records = readLocalStorage(SCHOLARSHIP_DETAIL_STORAGE.applications, [])
  if (!Array.isArray(records)) return []
  const unique = new Map()
  records.forEach((record) => {
    if (!record || typeof record !== 'object' || typeof record.scholarshipId !== 'string' || !record.scholarshipId.trim()) return
    const previous = unique.get(record.scholarshipId)
    const currentTime = Date.parse(record.updatedAt || record.createdAt || '') || 0
    const previousTime = previous ? Date.parse(previous.updatedAt || previous.createdAt || '') || 0 : -1
    if (!previous || currentTime >= previousTime) unique.set(record.scholarshipId, record)
  })
  return [...unique.values()]
}

/** Persist only demo application records while preserving each record's existing fields. */
export function saveDemoApplications(records) {
  const unique = new Map()
  ;(Array.isArray(records) ? records : []).forEach((record) => {
    if (!record || typeof record !== 'object' || typeof record.scholarshipId !== 'string' || !record.scholarshipId.trim()) return
    unique.set(record.scholarshipId, record)
  })
  const saved = writeLocalStorage(SCHOLARSHIP_DETAIL_STORAGE.applications, [...unique.values()])
  if (saved && typeof window !== 'undefined') window.dispatchEvent(new Event(SCHOLARSHIP_LOCAL_DATA_UPDATED_EVENT))
  return saved
}

/** Create one demo application per scholarship. Existing records are returned unchanged. */
export function addDemoApplication(record) {
  const current = getDemoApplications()
  const existing = current.find((item) => item.scholarshipId === record?.scholarshipId)
  if (existing) return { saved: true, added: false, records: current }
  const records = [...current, record]
  return { saved: saveDemoApplications(records), added: true, records }
}

export function getDemoReminders() {
  const reminders = readLocalStorage(SCHOLARSHIP_DETAIL_STORAGE.reminders, {})
  return reminders && typeof reminders === 'object' && !Array.isArray(reminders) ? reminders : {}
}
