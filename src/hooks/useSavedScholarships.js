import { useCallback, useEffect, useState } from 'react'
import { readLocalStorage, writeLocalStorage } from '../utils/localStorage.js'
import { SAVED_SCHOLARSHIPS_UPDATED_EVENT, STORAGE_KEYS } from '../utils/constants.js'
import { normalizeSavedScholarshipIds } from '../utils/savedScholarships.js'

function readIds() {
  const value = readLocalStorage(STORAGE_KEYS.savedScholarshipIds, [])
  return normalizeSavedScholarshipIds(value)
}

export default function useSavedScholarships() {
  const [savedIds, setSavedIds] = useState(readIds)
  useEffect(() => {
    const syncSavedIds = (event) => {
      if (event.key === STORAGE_KEYS.savedScholarshipIds || event.type === SAVED_SCHOLARSHIPS_UPDATED_EVENT || event.type === 'focus') setSavedIds(readIds())
    }
    window.addEventListener('storage', syncSavedIds)
    window.addEventListener(SAVED_SCHOLARSHIPS_UPDATED_EVENT, syncSavedIds)
    window.addEventListener('focus', syncSavedIds)
    return () => {
      window.removeEventListener('storage', syncSavedIds)
      window.removeEventListener(SAVED_SCHOLARSHIPS_UPDATED_EVENT, syncSavedIds)
      window.removeEventListener('focus', syncSavedIds)
    }
  }, [])

  const persist = useCallback((next) => {
    if (!writeLocalStorage(STORAGE_KEYS.savedScholarshipIds, next)) return null
    setSavedIds(next)
    window.dispatchEvent(new Event(SAVED_SCHOLARSHIPS_UPDATED_EVENT))
    return true
  }, [])

  const toggleSaved = useCallback((id) => {
    const current = readIds()
    const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    return persist(next) === null ? null : next.includes(id)
  }, [persist])

  const removeSaved = useCallback((ids) => {
    const remove = new Set(ids)
    return persist(readIds().filter((id) => !remove.has(id)))
  }, [persist])

  return { savedIds, toggleSaved, removeSaved }
}
