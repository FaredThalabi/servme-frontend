import api from '@/utils/api.js'

export function toStorageUrl(path) {
  if (!path) return ''
  try {
    const apiBase = api.defaults.baseURL || ''
    const origin = apiBase.replace(/\/?api\/?$/, '')
    // Ensure no leading slash duplication
    const cleanPath = String(path).replace(/^\/?/, '')
    return `${origin}/storage/${cleanPath}`
  } catch (_e) {
    return `/storage/${String(path).replace(/^\/?/, '')}`
  }
}


