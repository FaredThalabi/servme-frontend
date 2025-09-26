<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">ServMe</h1>
        <h2 class="text-2xl font-semibold text-gray-600">Admin Portal</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to access the admin dashboard</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card py-8 px-4 sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <BaseInput
            label="Email address"
            type="email"
            v-model="form.email"
            placeholder="john@doe.com"
            :errors="errors.email || []"
          />

          <!-- Password Field -->
          <BaseInput
            label="Password"
            type="password"
            v-model="form.password"
            placeholder="Enter your password"
            :errors="errors.password || []"
          />

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              :class="[
                'btn btn-primary w-full',
                loading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import BaseInput from '@/components/shared/BaseInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: 'admin@servme.com',
  password: '',
  remember: false
})

const errors = ref({})
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  errors.value = {}

  const result = await authStore.login(form)

  if (result.success) {
    router.push('/admin')
  } else {
    errors.value = result.errors
  }

  loading.value = false
}

onMounted(async () => {
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>
