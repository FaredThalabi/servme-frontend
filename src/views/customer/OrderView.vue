<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
      <div class="max-w-2xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Order Status</h1>
            <p class="text-sm text-gray-600 mt-1">Order #{{ orderNumber }}</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500 uppercase tracking-wide">Order ID</div>
            <div class="text-sm font-mono text-gray-700">{{ orderNumber }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-2xl mx-auto p-6">
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-10 text-gray-600">
          <svg class="animate-spin h-5 w-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Loading your order...
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Unable to load order</h3>
              <div class="mt-2 text-sm text-red-700">{{ errorMessage }}</div>
            </div>
          </div>
        </div>

        <!-- Order Content -->
        <div v-else>
          <!-- Status Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 mb-4">
              <div 
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  statusBadge.bg.replace('100', '500').replace('text-', 'bg-'),
                  'text-white'
                ]"
              >
                <svg v-if="order?.status === 'preparing'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <svg v-else-if="order?.status === 'ready'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <svg v-else-if="order?.status === 'completed'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ statusHeading }}</h2>
            <p class="text-gray-600 mb-4">{{ statusDescription }}</p>
            <span
              :class="[
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold',
                statusBadge.bg,
                statusBadge.text
              ]"
            >
              <span class="w-2 h-2 rounded-full mr-2" :class="statusBadge.dot"></span>
              {{ statusLabel }}
            </span>
          </div>
          <!-- Progress Timeline -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 text-center">Order Progress</h3>
            <div class="relative">
              <div class="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>
              <div class="relative flex justify-between">
                <div v-for="(step, index) in timeline" :key="step.key" class="flex flex-col items-center">
                  <div 
                    :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-300',
                      step.done 
                        ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/25' 
                        : 'bg-white text-gray-400 border-gray-200'
                    ]"
                  >
                    <svg v-if="step.done" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="mt-3 text-center">
                    <div 
                      :class="[
                        'text-sm font-medium',
                        step.done ? 'text-gray-900' : 'text-gray-500'
                      ]"
                    >
                      {{ step.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="space-y-6">
            <!-- Items -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Order Items
              </h3>
              <div v-if="items.length === 0" class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                No items found
              </div>
              <div v-else class="space-y-3">
                <div v-for="item in items" :key="item.id" class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ item.product_name }}</p>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">{{ formatCurrency(item.total_price) }}</p>
                    <p class="text-xs text-gray-500">{{ formatCurrency(item.product_price) }} each</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Order Summary
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-900">{{ formatCurrency(tax) }}</span>
                </div>
                <div class="border-t border-blue-200 pt-3">
                  <div class="flex justify-between text-lg font-bold">
                    <span class="text-gray-900">Total</span>
                    <span class="text-blue-600">{{ formatCurrency(total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Order Details
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Order Number</span>
                    <span class="font-mono text-gray-900">#{{ orderNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Placed At</span>
                    <span class="text-gray-900">{{ placedAt }}</span>
                  </div>
                  <div v-if="customerName" class="flex justify-between">
                    <span class="text-gray-600">Customer</span>
                    <span class="text-gray-900">{{ customerName }}</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-xl p-6 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Restaurant Info
                </h4>
                <div class="space-y-2 text-sm text-gray-600">
                  <p>Visit our counter to collect your order</p>
                  <p class="text-xs">Please keep this order number handy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import { ordersService } from '@/services/ordersService.js'

export default {
  name: 'OrderView',
  props: {
    id: {
      type: String,
      required: true
    },
    orderNumber: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      errorMessage: '',
      order: null,
      items: [],
      pollTimer: null,
    }
  },
  computed: {
    statusLabel() {
      const status = this.order?.status || 'preparing'
      const map = { pending: 'Pending', preparing: 'Preparing', ready: 'Ready', completed: 'Completed', cancelled: 'Cancelled' }
      return map[status] || 'Preparing'
    },
    statusHeading() {
      const status = this.order?.status || 'preparing'
      const map = {
        pending: 'Your order is pending',
        preparing: 'Your order is being prepared',
        ready: 'Your order is ready for pickup',
        completed: 'Enjoy your meal!',
        cancelled: 'Order was cancelled'
      }
      return map[status] || map.preparing
    },
    statusDescription() {
      const status = this.order?.status || 'preparing'
      const map = {
        pending: "We're confirming your order.",
        preparing: "We're working on your order. You'll be notified when it's ready.",
        ready: 'Please pick up your order at the counter.',
        completed: 'Thanks for ordering with us!',
        cancelled: 'Please contact support if this is unexpected.'
      }
      return map[status] || map.preparing
    },
    statusBadge() {
      const status = this.order?.status || 'preparing'
      const map = {
        pending: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' },
        preparing: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
        ready: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        completed: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
      }
      return map[status] || map.preparing
    },
    timeline() {
      const status = this.order?.status || 'preparing'
      const steps = [
        { key: 'pending', label: 'Pending' },
        { key: 'preparing', label: 'Preparing' },
        { key: 'ready', label: 'Ready' },
        { key: 'completed', label: 'Completed' }
      ]
      let doneUntil = steps.findIndex(s => s.key === status)
      if (doneUntil === -1) doneUntil = 1
      return steps.map((s, i) => ({ ...s, done: i <= doneUntil }))
    },
    total() {
      return Math.round((this.subtotal + this.tax) * 100) / 100
    },
    placedAt() {
      const ts = this.order?.created_at
      if (!ts) return ''
      try {
        return new Date(ts).toLocaleString()
      } catch (e) {
        return ''
      }
    },
    placedTime() {
      const ts = this.order?.created_at
      if (!ts) return ''
      try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } catch (e) {
        return ''
      }
    },
    customerName() {
      return this.order?.customer_name || ''
    },
    itemsCount() {
      return this.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0
    },
    summaryTotal() {
      return this.order?.total_amount || 0
    },
    total_amount() {
      return Number(this.order?.total_amount || 0)
    },
    subtotal() {
      return this.items?.reduce((sum, i) => sum + Number(i.total_price || 0), 0) || 0
    },
    tax() {
      const total = this.total_amount
      const subtotal = this.subtotal
      return Math.max(0, total - subtotal)
    }
  },
  methods: {
    async loadOrder() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const response = await ordersService.getById(this.id)
        // Handle the API response structure
        this.order = response.data || response
        // Map order_items to items
        this.items = this.order.order_items || []
      } catch (e) {
        this.errorMessage = e?.response?.data?.message || e?.message || 'Something went wrong.'
      } finally {
        this.isLoading = false
      }
    },
    startPolling() {
      this.stopPolling()
      this.pollTimer = setInterval(async () => {
        try {
          const response = await ordersService.getById(this.id)
          this.order = response.data || response
          this.items = this.order.order_items || []
          if (['completed', 'cancelled'].includes(this.order.status)) {
            this.stopPolling()
          }
        } catch (e) {
          // ignore transient errors in polling
        }
      }, 5000)
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },
    formatCurrency(value) {
      const num = Number(value || 0)
      try {
        return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', currencyDisplay: 'narrowSymbol' }).format(num)
      } catch (e) {
        return `RM${num.toFixed(2)}`
      }
    }
  },
  mounted() {
    this.loadOrder()
    this.startPolling()
  },
  beforeUnmount() {
    this.stopPolling()
  }
}
</script>
