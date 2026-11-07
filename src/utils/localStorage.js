/** Read a JSON value from localStorage, returning the fallback on unavailable storage or invalid data. */
export function readLocalStorage(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch (error) {
    console.warn(`Unable to read localStorage key "${key}".`, error)
    return fallback
  }
}

/** Persist a value as JSON. Returns false when storage is unavailable or quota is exceeded. */
export function writeLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Unable to save localStorage key "${key}".`, error)
    return false
  }
}

export function removeLocalStorage(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Unable to remove localStorage key "${key}".`, error)
    return false
  }
}
