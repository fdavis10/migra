import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { postPageView } from '@/api/analytics'

/** Учёт просмотров для дашборда панели; не рендерит UI. */
export function PageViewTracker() {
  const location = useLocation()
  const lastPathRef = useRef('')

  useEffect(() => {
    const path = `${location.pathname}${location.search}`
    if (path === lastPathRef.current) return
    lastPathRef.current = path
    postPageView(path).catch(() => {})
  }, [location.pathname, location.search])

  return null
}
