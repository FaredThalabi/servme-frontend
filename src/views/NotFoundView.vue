<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn btn-primary">
        Go Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
