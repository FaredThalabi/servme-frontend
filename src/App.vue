<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useTenantStore } from '@/stores/tenant.js'

const authStore = useAuthStore()
const tenantStore = useTenantStore()

onMounted(() => {
  // Initialize stores
  authStore.init()
  tenantStore.init()
})
</script>
