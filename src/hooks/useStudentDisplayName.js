import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../utils/constants.js'
import { getStudentDisplayName, STUDENT_PROFILE_UPDATED_EVENT } from '../utils/studentProfile.js'

export default function useStudentDisplayName() {
  const [name, setName] = useState(getStudentDisplayName)
  useEffect(() => {
    const syncName = (event) => {
      if (event.type === 'focus' || event.type === STUDENT_PROFILE_UPDATED_EVENT || event.key === STORAGE_KEYS.profile) setName(getStudentDisplayName())
    }
    window.addEventListener('focus', syncName)
    window.addEventListener('storage', syncName)
    window.addEventListener(STUDENT_PROFILE_UPDATED_EVENT, syncName)
    return () => {
      window.removeEventListener('focus', syncName)
      window.removeEventListener('storage', syncName)
      window.removeEventListener(STUDENT_PROFILE_UPDATED_EVENT, syncName)
    }
  }, [])
  return name
}
