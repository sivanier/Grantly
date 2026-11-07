import { useCallback, useEffect, useState } from 'react'
import { NOTIFICATION_DATA_UPDATED_EVENT, NOTIFICATION_SOURCE_KEYS, NOTIFICATION_SOURCE_UPDATED_EVENTS, buildNotifications, updateNotificationState } from '../utils/notifications.js'
import { STORAGE_KEYS, SAVED_SCHOLARSHIPS_UPDATED_EVENT } from '../utils/constants.js'

const READ_KEY = STORAGE_KEYS.notificationState

export default function useNotifications() {
  const [notifications, setNotifications] = useState(buildNotifications)
  const [availableNotifications, setAvailableNotifications] = useState(() => buildNotifications({ includeDismissed: true }))
  const refresh = useCallback(() => {
    setNotifications(buildNotifications())
    setAvailableNotifications(buildNotifications({ includeDismissed: true }))
  }, [])

  useEffect(() => {
    const onStorage = (event) => {
      if (!event.key || event.key === READ_KEY || NOTIFICATION_SOURCE_KEYS.includes(event.key)) refresh()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', refresh)
    window.addEventListener(NOTIFICATION_DATA_UPDATED_EVENT, refresh)
    window.addEventListener(SAVED_SCHOLARSHIPS_UPDATED_EVENT, refresh)
    NOTIFICATION_SOURCE_UPDATED_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh))
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', refresh)
      window.removeEventListener(NOTIFICATION_DATA_UPDATED_EVENT, refresh)
      window.removeEventListener(SAVED_SCHOLARSHIPS_UPDATED_EVENT, refresh)
      NOTIFICATION_SOURCE_UPDATED_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh))
    }
  }, [refresh])

  const changeState = useCallback((mutate) => {
    const saved = updateNotificationState(mutate)
    if (saved) refresh()
    return saved
  }, [refresh])

  const markRead = useCallback((id) => changeState((state) => ({ ...state, readIds: [...new Set([...state.readIds, id])] })), [changeState])
  const markUnread = useCallback((id) => changeState((state) => ({ ...state, readIds: state.readIds.filter((item) => item !== id) })), [changeState])
  const markAllRead = useCallback(() => changeState((state) => ({ ...state, readIds: [...new Set([...state.readIds, ...notifications.map((item) => item.id)])] })), [changeState, notifications])
  const dismiss = useCallback((id) => changeState((state) => ({ ...state, dismissedIds: [...new Set([...state.dismissedIds, id])] })), [changeState])
  const restoreDismissed = useCallback(() => changeState((state) => ({ ...state, dismissedIds: state.dismissedIds.filter((id) => !availableNotifications.some((item) => item.id === id && item.dismissed)) })), [availableNotifications, changeState])

  return { notifications, unreadCount: notifications.filter((item) => !item.read).length, dismissedCount: availableNotifications.filter((item) => item.dismissed).length, markRead, markUnread, markAllRead, dismiss, restoreDismissed, refresh }
}
