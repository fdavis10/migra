import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './authStorage'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

export const panelApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

panelApi.interceptors.request.use((config) => {
  const t = getAccessToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

panelApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const res = error.response
    const orig = error.config
    if (!res || res.status !== 401 || orig._panelRetry || orig.url?.includes('/panel/auth/token/')) {
      return Promise.reject(error)
    }
    const refresh = getRefreshToken()
    if (!refresh) {
      clearTokens()
      return Promise.reject(error)
    }
    orig._panelRetry = true
    try {
      const { data } = await axios.post(`${baseURL}/panel/auth/token/refresh/`, { refresh })
      setTokens(data.access, refresh)
      orig.headers.Authorization = `Bearer ${data.access}`
      return panelApi(orig)
    } catch {
      clearTokens()
      return Promise.reject(error)
    }
  },
)

export { baseURL as panelApiBaseURL }
