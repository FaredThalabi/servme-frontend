<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-lg mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Order Status</h1>
        <p class="text-sm text-gray-600 mt-1">Order #{{ orderNumber }}</p>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-lg mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Order Status -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-4">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            Preparing
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Your order is being prepared</h2>
          <p class="text-gray-600">
            We're working on your order. You'll be notified when it's ready.
          </p>
        </div>

        <!-- Order Details Placeholder -->
        <div class="border-t pt-6">
          <h3 class="font-semibold text-gray-900 mb-4">Order Details</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Order placed:</span>
              <span class="text-gray-900">{{ new Date().toLocaleTimeString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Estimated time:</span>
              <span class="text-gray-900">15-20 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'OrderView',
  props: {
    orderNumber: {
      type: String,
      required: true
    }
  },
  mounted() {
    console.log('Order view loaded for order:', this.orderNumber)
  }
}
</script>
