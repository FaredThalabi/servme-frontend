import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api.js'
import { setCurrentTenant, getCurrentTenant } from '@/utils/tenant.js'

export const useTenantStore = defineStore('tenant', () => {
  // State
  const tenants = ref([])
  const currentTenant = ref(getCurrentTenant())
  const loading = ref(false)

  // Getters
  const hasTenants = computed(() => tenants.value.length > 0)
  const currentTenantId = computed(() => currentTenant.value?.id)

  // Actions
  async function fetchTenants() {
    loading.value = true
    try {
      const response = await api.get('/v1/admin/tenants')
      const payload = response?.data?.data || response?.data || []
      // Support either { tenants: [...] } or a direct array
      tenants.value = Array.isArray(payload) ? payload : (payload.tenants || [])
      
      // If no current tenant is selected and we have tenants, select the first one
      if (!currentTenant.value && tenants.value.length > 0) {
        selectTenant(tenants.value[0])
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
      tenants.value = []
    } finally {
      loading.value = false
    }
  }

  function selectTenant(tenant) {
    currentTenant.value = tenant
    setCurrentTenant(tenant)
  }

  function clearTenant() {
    currentTenant.value = null
    setCurrentTenant(null)
  }

  // Initialize store
  function init() {
    const savedTenant = getCurrentTenant()
    if (savedTenant) {
      currentTenant.value = savedTenant
    }
    
    // Fetch tenants on initialization to enable auto-selection
    fetchTenants()
  }

  return {
    // State
    tenants,
    currentTenant,
    loading,
    // Getters
    hasTenants,
    currentTenantId,
    // Actions
    fetchTenants,
    selectTenant,
    clearTenant,
    init
  }
})
