import client from './client'

const STORAGE_KEY = 'migra_site_visitor_id'

export function getVisitorId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return undefined
  }
}

/** Отправка просмотра страницы (публичный API, без токена). */
export function postPageView(path) {
  const visitor_id = getVisitorId()
  return client.post('analytics/pageview/', { path, visitor_id })
}
