<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-lg mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Menu</h1>
        <p class="text-sm text-gray-600 mt-1">QR Code: {{ qr }}</p>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-lg mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm p-6 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Menu Coming Soon</h2>
        <p class="text-gray-600">
          This is the customer menu view. The menu items and ordering functionality will be implemented here.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'MenuView',
  props: {
    qr: {
      type: String,
      required: true
    }
  },
  mounted() {
    console.log('Menu view loaded for QR:', this.qr)
  }
}
</script>
