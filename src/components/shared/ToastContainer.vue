<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <div class="absolute top-4 right-4 space-y-3 w-[calc(100%-2rem)] sm:w-80">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto rounded-md shadow-lg border bg-white overflow-hidden"
        :class="typeClasses[t.type] || typeClasses.info"
      >
        <div class="px-4 py-3">
          <div class="flex items-start">
            <div class="flex-1 min-w-0">
              <p v-if="t.title" class="text-sm font-semibold text-gray-900">{{ t.title }}</p>
              <p class="text-sm text-gray-700" :class="t.title ? 'mt-0.5' : ''">{{ t.message }}</p>
            </div>
            <button class="ml-3 text-gray-400 hover:text-gray-600" @click="dismiss(t.id)">
              <span class="sr-only">Close</span>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications.js'

const notifications = useNotificationsStore()
const { toasts } = storeToRefs(notifications)

const typeClasses = computed(() => ({
  success: 'border-green-200',
  error: 'border-red-200',
  warning: 'border-yellow-200',
  info: 'border-gray-200'
}))

function dismiss(id) {
  notifications.dismiss(id)
}
</script>


