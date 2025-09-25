<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-lg mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Checkout</h1>
        <p class="text-sm text-gray-600 mt-1">Review your cart and enter your details</p>
      </div>
    </header>

    <main class="max-w-lg mx-auto p-4 space-y-6">
      <!-- Cart Summary -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-gray-900">Your Order</h2>
        </div>
        <div class="p-4 space-y-3">
          <div v-if="items.length === 0" class="text-gray-600 text-sm">Your cart is empty.</div>
          <div v-for="item in items" :key="item.productId + item.optionsKey" class="flex items-start justify-between">
            <div class="pr-3">
              <div class="font-medium text-gray-900">{{ item.name }}</div>
              <div class="mt-2 inline-flex items-center rounded border">
                <button type="button" class="px-3 py-1" @click="decrement(item)" :disabled="item.quantity <= 1">-</button>
                <span class="px-3 py-1 border-l border-r">{{ item.quantity }}</span>
                <button type="button" class="px-3 py-1" @click="increment(item)">+</button>
              </div>
              <button type="button" class="ml-3 text-sm text-red-600" @click="remove(item)">Remove</button>
            </div>
            <div class="font-semibold text-gray-900 whitespace-nowrap">{{ formatPrice(item.price * item.quantity) }}</div>
          </div>
          <div class="border-t pt-3 flex items-center justify-between">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-semibold text-gray-900">{{ formatPrice(subtotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Registration / Contact Form -->
      <form class="bg-white rounded-lg shadow-sm" @submit.prevent="proceedToPayment">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-gray-900">Your Details</h2>
        </div>
        <div class="p-4 space-y-4">
          <VInput label="Name" v-model="form.name" placeholder="Your name" />
          <VInput label="Phone" type="tel" v-model="form.phone" placeholder="e.g. 012-3456789" />
          <VInput label="Email (optional)" type="email" v-model="form.email" placeholder="you@example.com" />
          <div>
            <label class="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea v-model="form.notes" rows="3" class="input mt-1" placeholder="Any special requests?"></textarea>
          </div>
        </div>
        <div class="p-4 border-t flex items-center justify-between">
          <router-link to="/menu/demo" class="text-primary-600">Back to Menu</router-link>
          <button type="submit" class="btn btn-primary" :disabled="items.length === 0">Proceed to Payment</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import VInput from '@/components/input/VInput.vue'

const cart = useCartStore()
const items = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  notes: ''
})

function formatPrice(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
}

async function proceedToPayment() {
  // Placeholder: integrate payment gateway flow here
  alert('Proceeding to payment...')
}

function increment(item) {
  cart.updateQuantity(item.productId, item.quantity + 1, item.optionsKey)
}

function decrement(item) {
  if (item.quantity > 1) {
    cart.updateQuantity(item.productId, item.quantity - 1, item.optionsKey)
  }
}

function remove(item) {
  cart.removeItem(item.productId, item.optionsKey)
}
</script>


