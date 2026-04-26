/** URL картинки из DRF (абсолютный или /media/...) */
export function mediaUrl(path) {
  if (!path) return null
  const s = String(path).trim()
  if (!s) return null
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return s.startsWith('/') ? s : `/${s}`
}
