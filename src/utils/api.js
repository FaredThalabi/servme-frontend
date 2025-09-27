import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Temporary default tenant for customer menu until QR/selection flow is wired
const DEFAULT_TENANT_ID = '01997f28-0912-72d7-8471-ccb1477d859a'

// Request interceptor to add auth token and tenant ID
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add tenant ID header if available
    const tenantId = localStorage.getItem('selected_tenant_id') || DEFAULT_TENANT_ID
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('admin_token')
      localStorage.removeItem('selected_tenant_id')
      
      // Only redirect admin routes to login, not customer routes
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
