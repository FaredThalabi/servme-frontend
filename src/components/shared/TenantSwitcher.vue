<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <span class="truncate max-w-32">
        {{ currentTenant?.name || 'Select Tenant' }}
      </span>
      <ChevronDownIcon class="ml-2 h-4 w-4" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div class="py-1">
        <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
          Available Tenants
        </div>
        
        <div v-if="loading" class="px-4 py-2 text-sm text-gray-500">
          Loading tenants...
        </div>
        
        <div v-else-if="tenants.length === 0" class="px-4 py-2 text-sm text-gray-500">
          No tenants available
        </div>
        
        <template v-else>
          <button
            v-for="tenant in tenants"
            :key="tenant.id"
            @click="selectTenant(tenant)"
            :class="[
              'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
              currentTenant?.id === tenant.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="truncate">{{ tenant.name }}</span>
              <span
                v-if="tenant.is_active"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Active
              </span>
            </div>
          </button>
          
          <!-- Clear Selection -->
          <button
            v-if="currentTenant"
            @click="clearSelection"
            class="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 border-t border-gray-200"
          >
            Clear Selection
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useTenantStore } from '@/stores/tenant.js'

const tenantStore = useTenantStore()
const { tenants, currentTenant, loading } = storeToRefs(tenantStore)

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
  
  // Load tenants when dropdown is opened for the first time
  if (showDropdown.value && tenants.value.length === 0 && !loading.value) {
    tenantStore.fetchTenants()
  }
}

function selectTenant(tenant) {
  tenantStore.selectTenant(tenant)
  showDropdown.value = false
  
  // Emit event for parent components to react to tenant change
  // You can add this if needed for dashboard refresh
  window.dispatchEvent(new CustomEvent('tenant-changed', { detail: tenant }))
}

function clearSelection() {
  tenantStore.clearTenant()
  showDropdown.value = false
  
  window.dispatchEvent(new CustomEvent('tenant-changed', { detail: null }))
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Load tenants on mount if not already loaded
  if (tenants.value.length === 0 && !loading.value) {
    tenantStore.fetchTenants()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
