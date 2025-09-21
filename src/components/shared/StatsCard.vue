<template>
  <div class="card">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconClasses">
            <component :is="iconComponent" class="h-6 w-6" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {{ value }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'chart-bar'
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const iconComponent = computed(() => {
  const icons = {
    'shopping-bag': ShoppingBagIcon,
    'currency-dollar': CurrencyDollarIcon,
    'clock': ClockIcon,
    'chart-bar': ChartBarIcon,
    'user-group': UserGroupIcon,
    'building-storefront': BuildingStorefrontIcon
  }
  return icons[props.icon] || ChartBarIcon
})

const iconClasses = computed(() => {
  const baseClasses = 'h-10 w-10 rounded-full flex items-center justify-center'
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600'
  }
  return `${baseClasses} ${colorClasses[props.color] || colorClasses.blue}`
})
</script>
