import { defineStore } from 'pinia'
import { ref } from 'vue'

let counter = 0

export const useNotificationsStore = defineStore('notifications', () => {
  const toasts = ref([])

  function push({ title = '', message = '', type = 'success', timeout = 3000 } = {}) {
    const id = ++counter
    const toast = { id, title, message, type }
    toasts.value.push(toast)
    if (timeout > 0) {
      setTimeout(() => dismiss(id), timeout)
    }
    return id
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  return { toasts, push, dismiss, clear }
})


