const KEY = 'panel_tech_logs_token'

export function getTechLogsToken() {
  return sessionStorage.getItem(KEY) || ''
}

export function setTechLogsToken(token) {
  if (token) sessionStorage.setItem(KEY, token)
  else sessionStorage.removeItem(KEY)
}

export function clearTechLogsToken() {
  sessionStorage.removeItem(KEY)
}

export function isTechLogsUnlocked() {
  return Boolean(getTechLogsToken())
}
