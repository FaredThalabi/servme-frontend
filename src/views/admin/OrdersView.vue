<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your restaurant orders</p>
      </div>
      <div class="flex space-x-3">
        <BaseButton variant="outline" @click="loadOrders">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.total || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.pending || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Preparing</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.preparing || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.completed || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <VInput
            v-model="filters.search"
            placeholder="Search by order number, customer..."
            @input="debouncedSearch"
          />
        </div>
        <div class="min-w-40">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <VSelect
            id="status"
            v-model="filters.status"
            :options="[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'preparing', label: 'Preparing' },
              { value: 'ready', label: 'Ready' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'desserts', label: 'Desserts' }
            ]"
            @change="loadOrders"
          >
          </VSelect>
        </div>
        <div class="min-w-40">
          <label for="date_range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <VSelect
            id="date_range"
            v-model="filters.date_range"
            :options="[
              { value: '', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'this_week', label: 'This Week' },
              { value: 'this_month', label: 'This Month' },
            ]"
            @change="loadOrders"
          >
          >
          </VSelect>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="px-4 py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-500">Loading orders...</p>
      </div>

      <div v-else-if="orders.length === 0" class="px-4 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">Orders will appear here when customers place them.</p>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="order in orders" :key="order.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">#{{ order.order_number }}</span>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <p class="text-sm font-medium text-gray-900">
                    Order #{{ order.order_number }}
                  </p>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(order.status)
                    ]"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                </div>
                
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ order.customer_name || 'Guest' }}</span>
                  <span>•</span>
                  <span>{{ order.items_count }} {{ order.items_count === 1 ? 'item' : 'items' }}</span>
                  <span>•</span>
                  <span>${{ order.total_amount }}</span>
                  <span>•</span>
                  <span>{{ formatDateTime(order.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <BaseButton
                v-if="order.status === 'pending'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'confirmed')"
                :loading="order.updating"
              >
                Confirm
              </BaseButton>
              
              <BaseButton
                v-if="order.status === 'confirmed'"
                variant="primary"
                size="sm"
                @click="updateOrderStatus(order, 'preparing')"
                :loading="order.updating"
              >
                Start Preparing
              </BaseButton>
              
              <BaseButton
                v-if="order.status === 'preparing'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'ready')"
                :loading="order.updating"
              >
                Mark Ready
              </BaseButton>
              
              <BaseButton
                v-if="order.status === 'ready'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'completed')"
                :loading="order.updating"
              >
                Complete
              </BaseButton>

              <BaseButton
                variant="outline"
                size="sm"
                @click="viewOrderDetails(order)"
              >
                View Details
              </BaseButton>
              
              <BaseButton
                v-if="['pending', 'confirmed'].includes(order.status)"
                variant="danger"
                size="sm"
                @click="confirmCancel(order)"
              >
                Cancel
              </BaseButton>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Order Details Modal -->
    <BaseModal
      :show="showDetailsModal"
      title="Order Details"
      size="lg"
      @close="showDetailsModal = false"
    >
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Order Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-900">Order Information</h4>
            <dl class="mt-2 text-sm text-gray-600 space-y-1">
              <div class="flex justify-between">
                <dt>Order Number:</dt>
                <dd class="font-medium">#{{ selectedOrder.order_number }}</dd>
              </div>
              <div class="flex justify-between">
                <dt>Status:</dt>
                <dd>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(selectedOrder.status)
                    ]"
                  >
                    {{ formatStatus(selectedOrder.status) }}
                  </span>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt>Date:</dt>
                <dd>{{ formatDateTime(selectedOrder.created_at) }}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900">Customer Information</h4>
            <dl class="mt-2 text-sm text-gray-600 space-y-1">
              <div class="flex justify-between">
                <dt>Name:</dt>
                <dd class="font-medium">{{ selectedOrder.customer_name || 'Guest' }}</dd>
              </div>
              <div v-if="selectedOrder.customer_phone" class="flex justify-between">
                <dt>Phone:</dt>
                <dd>{{ selectedOrder.customer_phone }}</dd>
              </div>
              <div v-if="selectedOrder.table_number" class="flex justify-between">
                <dt>Table:</dt>
                <dd>{{ selectedOrder.table_number }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
          <div class="space-y-3">
            <div
              v-for="item in selectedOrder.items"
              :key="item.id"
              class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ item.product_name }}</p>
                <p v-if="item.notes" class="text-xs text-gray-500 mt-1">{{ item.notes }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ item.quantity }} × ${{ item.price }} = ${{ (item.quantity * item.price).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Order Total -->
          <div class="border-t border-gray-200 pt-3 mt-3">
            <div class="flex justify-between items-center">
              <p class="text-base font-medium text-gray-900">Total</p>
              <p class="text-lg font-bold text-gray-900">${{ selectedOrder.total_amount }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Cancel Order Modal -->
    <BaseModal
      :show="showCancelModal"
      title="Cancel Order"
      @close="showCancelModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Are you sure you want to cancel order <strong>#{{ orderToCancel?.order_number }}</strong>?
        </p>
        
        <div>
          <label for="cancel_reason" class="block text-sm font-medium text-gray-700">Reason (optional)</label>
          <textarea
            id="cancel_reason"
            v-model="cancelReason"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter cancellation reason..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="showCancelModal = false"
          class="mr-3"
        >
          Keep Order
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="cancelOrder"
          :loading="cancelling"
        >
          Cancel Order
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ordersService } from '@/services/ordersService.js'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import VInput from '../../components/input/VInput.vue'
import VSelect from '../../components/input/VSelect.vue'

// Reactive data
const orders = ref([])
const stats = ref({})
const loading = ref(true)
const cancelling = ref(false)

// Modal states
const showDetailsModal = ref(false)
const showCancelModal = ref(false)

// Selected data
const selectedOrder = ref(null)
const orderToCancel = ref(null)
const cancelReason = ref('')

// Filters
const filters = reactive({
  search: '',
  status: '',
  date_range: ''
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadOrders()
  }, 300)
}

// Methods
async function loadOrders() {
  try {
    loading.value = true
    const params = {}
    
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.date_range) params.date_range = filters.date_range
    
    const response = await ordersService.getAll(params)
    orders.value = response.data || response
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const response = await ordersService.getStats()
    stats.value = response.data || response
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

async function updateOrderStatus(order, newStatus) {
  try {
    order.updating = true
    await ordersService.updateStatus(order.id, newStatus)
    await Promise.all([loadOrders(), loadStats()])
  } catch (error) {
    console.error('Error updating order status:', error)
  } finally {
    order.updating = false
  }
}

async function viewOrderDetails(order) {
  try {
    const response = await ordersService.getById(order.id)
    selectedOrder.value = response.data || response
    showDetailsModal.value = true
  } catch (error) {
    console.error('Error loading order details:', error)
  }
}

function confirmCancel(order) {
  orderToCancel.value = order
  cancelReason.value = ''
  showCancelModal.value = true
}

async function cancelOrder() {
  try {
    cancelling.value = true
    await ordersService.cancel(orderToCancel.value.id, cancelReason.value)
    showCancelModal.value = false
    orderToCancel.value = null
    cancelReason.value = ''
    await Promise.all([loadOrders(), loadStats()])
  } catch (error) {
    console.error('Error cancelling order:', error)
  } finally {
    cancelling.value = false
  }
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function formatStatus(status) {
  const statuses = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

function formatDateTime(dateTime) {
  if (!dateTime) return ''
  
  const date = new Date(dateTime)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    // Show time if it's today
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffInHours < 48) {
    // Show "Yesterday" if it was yesterday
    return 'Yesterday ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    // Show full date for older orders
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    loadOrders(),
    loadStats()
  ])
})
</script>
