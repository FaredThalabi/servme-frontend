<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile sidebar overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 z-40 lg:hidden"
      @click="sidebarOpen = false"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6">
          <h1 class="text-xl font-bold">ServMe</h1>
          <button
            @click="sidebarOpen = false"
            class="lg:hidden text-gray-300 hover:text-white"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <RouterLink
            to="/admin"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              $route.name === 'admin-dashboard'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            Dashboard
          </RouterLink>

          <RouterLink
            to="/admin/orders"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              $route.name === 'admin-orders'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Orders
          </RouterLink>

          <RouterLink
            to="/admin/products"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              $route.name === 'admin-products'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </RouterLink>

          <RouterLink
            to="/admin/categories"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              $route.name === 'admin-categories'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
            Categories
          </RouterLink>
        </nav>

      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top navbar -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <!-- Mobile menu button -->
              <button
                @click="sidebarOpen = true"
                class="lg:hidden text-gray-500 hover:text-gray-600 mr-4"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <!-- Page title or breadcrumb can go here -->
              <h1 class="lg:hidden text-xl font-semibold text-gray-900">ServMe Admin</h1>
            </div>

            <!-- Right side: Tenant switcher and user menu -->
            <div class="flex items-center space-x-4">
              <!-- Tenant Switcher -->
              <TenantSwitcher />
              
              <!-- User Menu -->
              <div class="relative">
                <button
                  @click="showTopUserMenu = !showTopUserMenu"
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ authStore.user?.name?.charAt(0) || 'A' }}
                    </span>
                  </div>
                </button>

                <!-- User Menu Dropdown -->
                <div
                  v-if="showTopUserMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  @click="showTopUserMenu = false"
                >
                  <div class="py-1">
                    <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <div class="font-medium">{{ authStore.user?.name || 'Admin' }}</div>
                      <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
                    </div>
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 p-6 bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import TenantSwitcher from '@/components/shared/TenantSwitcher.vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showTopUserMenu = ref(false)
const sidebarOpen = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (showUserMenu.value && !event.target.closest('.relative')) {
    showUserMenu.value = false
  }
  if (showTopUserMenu.value && !event.target.closest('.relative')) {
    showTopUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
