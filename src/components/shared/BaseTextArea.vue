<template>
  <div class="relative">
    <textarea
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="[
        'block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        disabled
          ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
          : 'bg-white text-gray-900',
        resize === 'none' ? 'resize-none' : resize === 'vertical' ? 'resize-y' : 'resize'
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    
    <!-- Help text -->
    <p v-if="help && !error" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value) => ['none', 'vertical', 'horizontal', 'both'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>
