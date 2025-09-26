<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:outline-none focus:ring-2 transition-colors',
        errors?.length
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
        disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900',
        $attrs.class
      ]"
      @change="$emit('change', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <!-- Placeholder option -->
      <option 
        v-if="placeholder" 
        :value="placeholderValue" 
        :disabled="placeholderDisabled"
        hidden
      >
        {{ placeholder }}
      </option>
      
      <!-- Options from array format -->
      <template v-if="options && options.length > 0">
        <option 
          v-for="option in options" 
          :key="getOptionValue(option)" 
          :value="getOptionValue(option)"
          :disabled="getOptionDisabled(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </template>
      
      <!-- Fallback for slot content -->
      <slot v-else />
    </select>

    <!-- Error message -->
    <div v-if="errors?.length" class="mt-1 text-sm text-red-600">
      {{ errors[0] }}
    </div>
    
    <!-- Help text -->
    <div v-if="help && !errors?.length" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { 
    type: [String, Number, Boolean], 
    default: '' 
  },
  label: { 
    type: String, 
    default: '' 
  },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substring(2, 9)}`,
  },
  options: { 
    type: Array, 
    default: () => [] 
  },
  placeholder: { 
    type: String, 
    default: 'Please select' 
  },
  placeholderValue: {
    type: [String, Number],
    default: ''
  },
  placeholderDisabled: {
    type: Boolean,
    default: true
  },
  disabled: { 
    type: Boolean, 
    default: false 
  },
  required: { 
    type: Boolean, 
    default: false 
  },
  errors: { 
    type: Array, 
    default: () => [] 
  },
  help: { 
    type: String, 
    default: '' 
  },
  // Option format configuration
  valueKey: { 
    type: String, 
    default: 'value' 
  },
  labelKey: { 
    type: String, 
    default: 'label' 
  },
  disabledKey: { 
    type: String, 
    default: 'disabled' 
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Helper functions to handle different option formats
function getOptionValue(option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.valueKey] ?? option.value ?? option
}

function getOptionLabel(option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.labelKey] ?? option.label ?? option.name ?? option
}

function getOptionDisabled(option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return false
  }
  return option[props.disabledKey] ?? option.disabled ?? false
}
</script>
