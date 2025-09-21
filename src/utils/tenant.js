import api from './api.js'

/**
 * Get current selected tenant ID
 */
export function getCurrentTenantId() {
  return localStorage.getItem('selected_tenant_id')
}

/**
 * Get current selected tenant object
 */
export function getCurrentTenant() {
  try {
    const tenant = localStorage.getItem('admin_selected_tenant')
    return tenant ? JSON.parse(tenant) : null
  } catch (error) {
    console.error('Error parsing tenant data:', error)
    return null
  }
}

/**
 * Set current tenant
 */
export function setCurrentTenant(tenant) {
  if (tenant) {
    localStorage.setItem('admin_selected_tenant', JSON.stringify(tenant))
    localStorage.setItem('selected_tenant_id', tenant.id)
  } else {
    localStorage.removeItem('admin_selected_tenant')
    localStorage.removeItem('selected_tenant_id')
  }
}

/**
 * Make API call with tenant context
 */
export async function apiCallWithTenant(url, options = {}, tenantId = null) {
  const finalTenantId = tenantId || getCurrentTenantId()
  
  // Temporarily set tenant ID for this request
  if (finalTenantId) {
    const currentTenantId = getCurrentTenantId()
    setCurrentTenant({ id: finalTenantId })
    
    try {
      const response = await api(url, options)
      return response
    } finally {
      // Restore original tenant ID
      if (currentTenantId) {
        localStorage.setItem('selected_tenant_id', currentTenantId)
      } else {
        localStorage.removeItem('selected_tenant_id')
      }
    }
  }
  
  return api(url, options)
}

/**
 * Clear tenant context
 */
export function clearTenantContext() {
  localStorage.removeItem('admin_selected_tenant')
  localStorage.removeItem('selected_tenant_id')
}
