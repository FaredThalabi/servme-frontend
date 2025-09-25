import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api.js'
import { setCurrentTenant } from '@/utils/tenant.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  async function login(credentials) {
    loading.value = true
    try {
      const response = await api.post('/v1/admin/login', credentials)

      // Some backends wrap payload under data, support both shapes
      const payload = response?.data?.data || response?.data || {}
      const { token: authToken, user: userData, tenant } = payload

      // Store token and user data
      token.value = authToken
      user.value = userData
      localStorage.setItem('admin_token', authToken)
      // Persist selected tenant context if provided
      if (tenant) {
        setCurrentTenant(tenant)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        errors: error.response?.data?.errors || { email: ['Login failed'] }
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/v1/admin/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API success
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_selected_tenant')
      localStorage.removeItem('selected_tenant_id')
    }
  }

  async function checkAuth() {
    if (!token.value) return false

    try {
      const response = await api.get('/v1/admin/auth-check')
      const payload = response?.data?.data || response?.data || {}
      user.value = payload.user || null
      return !!user.value
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      return false
    }
  }

  // Initialize store
  function init() {
    if (token.value) {
      checkAuth()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    checkAuth,
    init
  }
})
