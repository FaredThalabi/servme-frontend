import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadInitialItems())

  function loadInitialItems() {
    try {
      const raw = localStorage.getItem('customer_cart_items')
      return raw ? JSON.parse(raw) : []
    } catch (_) {
      return []
    }
  }

  const itemCount = computed(() => items.value.reduce((acc, it) => acc + it.quantity, 0))
  const subtotal = computed(() => items.value.reduce((acc, it) => acc + it.quantity * it.price, 0))

  function persist() {
    localStorage.setItem('customer_cart_items', JSON.stringify(items.value))
  }

  function findIndex(productId, optionsKey = '') {
    return items.value.findIndex((it) => it.productId === productId && it.optionsKey === optionsKey)
  }

  function addItem({ productId, name, price, imageUrl = '', optionsKey = '' }, quantity = 1) {
    const index = findIndex(productId, optionsKey)
    if (index >= 0) {
      items.value[index].quantity += quantity
    } else {
      items.value.push({ productId, name, price, imageUrl, optionsKey, quantity })
    }
    persist()
  }

  function updateQuantity(productId, quantity, optionsKey = '') {
    const index = findIndex(productId, optionsKey)
    if (index >= 0) {
      items.value[index].quantity = Math.max(1, quantity)
      persist()
    }
  }

  function removeItem(productId, optionsKey = '') {
    items.value = items.value.filter((it) => !(it.productId === productId && it.optionsKey === optionsKey))
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  // Keep localStorage in sync even if items ref is reassigned
  watch(items, persist, { deep: true })

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clear
  }
})


