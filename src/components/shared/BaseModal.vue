<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        ref="modalContent"
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg flex flex-col max-h-[85vh]"
        :class="sizeClasses"
      >
        <!-- Header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex-1 overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ title }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const modalContent = ref(null)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  }
  return sizes[props.size]
})

function handleBackdropClick(event) {
  if (props.closeOnBackdrop && modalContent.value && !modalContent.value.contains(event.target)) {
    emit('close')
  }
}

// Handle escape key
watch(() => props.show, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

function handleEscape(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}
</script>
