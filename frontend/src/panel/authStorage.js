const ACCESS = 'panel_access'
const REFRESH = 'panel_refresh'

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS)
  } catch {
    return null
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH)
  } catch {
    return null
  }
}

export function setTokens(access, refresh) {
  try {
    localStorage.setItem(ACCESS, access)
    if (refresh) localStorage.setItem(REFRESH, refresh)
  } catch {
    /* ignore */
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem(REFRESH)
  } catch {
    /* ignore */
  }
}

export function isPanelAuthenticated() {
  return Boolean(getAccessToken())
}
