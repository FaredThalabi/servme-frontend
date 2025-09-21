<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">
        Welcome back! Here's what's happening with your restaurants.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Orders"
        :value="stats.total_orders || 0"
        icon="shopping-bag"
        color="blue"
      />
      <StatsCard
        title="Total Revenue"
        :value="formatCurrency(stats.total_revenue || 0)"
        icon="currency-dollar"
        color="green"
      />
      <StatsCard
        title="Pending Orders"
        :value="stats.pending_orders || 0"
        icon="clock"
        color="yellow"
      />
      <StatsCard
        title="Today's Orders"
        :value="stats.todays_orders || 0"
        icon="chart-bar"
        color="purple"
      />
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
          <RouterLink
            to="/admin/orders"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </RouterLink>
        </div>
        
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Loading orders...</p>
        </div>
        
        <div v-else-if="recentOrders.length === 0" class="text-center py-8">
          <p class="text-gray-500">No recent orders</p>
        </div>
        
        <div v-else class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in recentOrders.slice(0, 5)" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.order_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer_name || 'Guest' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(order.total_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Merchants (if no tenant selected) -->
    <div v-if="!currentTenant && merchants.length > 0" class="card">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Your Restaurants</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="merchant in merchants"
            :key="merchant.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
            @click="selectMerchant(merchant)"
          >
            <h4 class="font-medium text-gray-900">{{ merchant.name }}</h4>
            <p class="text-sm text-gray-500 mt-1">{{ merchant.description || 'No description' }}</p>
            <div class="mt-2 flex items-center">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  merchant.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ merchant.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTenantStore } from '@/stores/tenant.js'
import api from '@/utils/api.js'
import StatsCard from '@/components/shared/StatsCard.vue'

const tenantStore = useTenantStore()
const { currentTenant } = storeToRefs(tenantStore)

const stats = ref({})
const recentOrders = ref([])
const merchants = ref([])
const loading = ref(false)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusBadgeClass = (status) => {
  const classes = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  switch (status) {
    case 'pending':
      return `${classes} bg-yellow-100 text-yellow-800`
    case 'confirmed':
      return `${classes} bg-blue-100 text-blue-800`
    case 'preparing':
      return `${classes} bg-orange-100 text-orange-800`
    case 'ready':
      return `${classes} bg-green-100 text-green-800`
    case 'completed':
      return `${classes} bg-gray-100 text-gray-800`
    case 'cancelled':
      return `${classes} bg-red-100 text-red-800`
    default:
      return `${classes} bg-gray-100 text-gray-800`
  }
}

const selectMerchant = (merchant) => {
  tenantStore.selectTenant(merchant)
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    let url = '/v1/admin/dashboard'
    
    // Use tenant-specific endpoint if tenant is selected
    if (currentTenant.value) {
      url = '/v1/admin/tenant/dashboard'
    }
    
    const response = await api.get(url)
    
    stats.value = response.data.stats || {}
    recentOrders.value = response.data.recent_orders || []
    merchants.value = response.data.merchants || []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
  
  // Listen for tenant changes
  window.addEventListener('tenant-changed', loadDashboardData)
})
</script>
