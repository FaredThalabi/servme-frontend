<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Menu</h1>
          <p class="text-sm text-gray-600 mt-1">QR Code: {{ qr }}</p>
        </div>
        <router-link to="/checkout" class="relative inline-flex items-center">
          <span class="btn btn-primary">Cart ({{ itemCount }})</span>
        </router-link>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-4 pb-28">
      <!-- Search -->
      <div class="mb-4">
        <div class="relative">
          <input v-model="search" type="text" class="input pl-10" placeholder="Search menu..." />
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="mb-5 flex gap-2 overflow-x-auto">
        <button
          class="px-3 py-1 rounded-full border text-sm"
          :class="activeCategory === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'"
          @click="setCategory(null)">All</button>
        <button
          v-for="c in categories"
          :key="c.id"
          class="px-3 py-1 rounded-full border text-sm whitespace-nowrap"
          :class="activeCategory === c.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'"
          @click="setCategory(c.id)">{{ c.name }}</button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Loading skeletons -->
        <template v-if="loading">
          <div v-for="i in 6" :key="'sk-'+i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div class="h-32 bg-gray-200"></div>
            <div class="p-4 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 rounded w-full"></div>
              <div class="h-8 bg-gray-200 rounded w-1/3 mt-3"></div>
            </div>
          </div>
        </template>

        <!-- Product card -->
        <div v-else v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-lg shadow-sm overflow-hidden group">
          <div class="relative h-32 sm:h-40 bg-gray-100">
            <img v-if="product.imageUrl" :src="product.imageUrl" alt="" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{{ product.name }}</h3>
              <div class="ml-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ formatPrice(product.price) }}</div>
            </div>
            <div class="mt-1">
              <span
                v-if="product.categoryId && categoriesById[product.categoryId]"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {{ categoriesById[product.categoryId] }}
              </span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ product.description }}</p>
            <div class="mt-3 flex items-center justify-between">
              <div class="inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
                <button 
                  type="button" 
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                  @click="decrementQty(product.id)" 
                  :disabled="getQty(product.id) <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="w-10 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-l border-r border-gray-300">{{ getQty(product.id) }}</span>
                <button 
                  type="button" 
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100" 
                  @click="incrementQty(product.id)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors" @click="addToCart(product)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add ({{ getQty(product.id) }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Cart Summary -->
      <div class="fixed left-0 right-0 bottom-0 bg-white/95 backdrop-blur border-t">
        <div class="max-w-3xl mx-auto p-4">
          <router-link to="/checkout" class="w-full btn btn-primary flex items-center justify-between">
            <span class="font-semibold">View Cart ({{ itemCount }})</span>
            <span class="opacity-90">Subtotal: {{ formatPrice(subtotal) }}</span>
          </router-link>
        </div>
      </div>
    </main>
  </div>
 </template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import { setCurrentTenant } from '@/utils/tenant.js'
import { productsService } from '@/services/productsService.js'
import { categoriesService } from '@/services/categoriesService.js'

const props = defineProps({
  qr: { type: String, required: true }
})

const products = ref([])
const categories = ref([])
const categoriesById = computed(() => {
  return categories.value.reduce((acc, c) => {
    acc[c.id] = c.name
    return acc
  }, {})
})
const activeCategory = ref(null)
const search = ref('')
const loading = ref(false)
const cart = useCartStore()
const itemCount = computed(() => cart.itemCount)
const subtotal = computed(() => cart.subtotal)
const localQty = ref({})

function formatPrice(value) {
  const amount = Number(value || 0)
  try {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', currencyDisplay: 'narrowSymbol' }).format(amount)
  } catch (e) {
    return `RM${amount.toFixed(2)}`
  }
}

function normalizeProduct(p) {
  // Normalize based on potential API shapes
  const base = p?.data || p
  return {
    id: base.id,
    name: base.name,
    description: base.description || '',
    price: Number(base.price || base.unit_price || 0),
    imageUrl: base.image_url || base.imageUrl || ''
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const resp = await productsService.getAll({ qr: props.qr })
    const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : []
    products.value = list.map((p) => {
      const np = normalizeProduct(p)
      np.categoryId = p.category_id || p.categoryId || null
      return np
    })
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const resp = await categoriesService.getAll()
    const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : []
    categories.value = list.map((c) => ({ id: c.id, name: c.name }))
  } catch (e) {
    categories.value = []
  }
}

function addToCart(product) {
  const qty = getQty(product.id)
  cart.addItem({
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl
  }, qty)
  // reset to 1 after adding
  localQty.value[product.id] = 1
}

const filteredProducts = computed(() => {
  const text = search.value.trim().toLowerCase()
  return products.value.filter((p) => {
    const byCategory = activeCategory.value ? p.categoryId === activeCategory.value : true
    const byText = text ? (p.name?.toLowerCase().includes(text) || p.description?.toLowerCase().includes(text)) : true
    return byCategory && byText
  })
})

function setCategory(id) {
  activeCategory.value = id
}

// Quantity controls per product card
function getQty(productId) {
  const val = localQty.value[productId]
  return val && val > 0 ? val : 1
}

function incrementQty(productId) {
  const current = getQty(productId)
  localQty.value[productId] = current + 1
}

function decrementQty(productId) {
  const current = getQty(productId)
  localQty.value[productId] = Math.max(1, current - 1)
}

onMounted(() => {
  // If QR encodes the tenant ID directly, set it so API calls include X-Tenant-ID
  if (props.qr) {
    setCurrentTenant({ id: props.qr })
  }
  loadProducts()
  loadCategories()
})
</script>
