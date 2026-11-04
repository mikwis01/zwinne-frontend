const STORAGE_KEY = 'reloadAttempts'
const MAX_ATTEMPTS = 1
const WINDOW_MS = 10 * 60 * 1000

type ReloadAttempts = {
  count: number
  firstAt: number
}

const readAttempts = (): ReloadAttempts | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ReloadAttempts) : null
  } catch {
    return null
  }
}

const writeAttempts = (attempts: ReloadAttempts) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  } catch {
    // ignore quota / disabled storage
  }
}

/**
 * Reloads the page at most `MAX_ATTEMPTS` times per `WINDOW_MS`, so a
 * permanently broken chunk can't put the app into an infinite reload loop.
 * Returns whether the reload happened.
 */
export const throttledReload = (): boolean => {
  const now = Date.now()
  const existing = readAttempts()

  const next: ReloadAttempts =
    existing && now - existing.firstAt < WINDOW_MS
      ? { count: existing.count + 1, firstAt: existing.firstAt }
      : { count: 1, firstAt: now }

  if (next.count > MAX_ATTEMPTS) {
    return false
  }

  writeAttempts(next)
  window.location.reload()

  return true
}
