<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>

    <select
      :id="id"
      v-model="model"
      :class="[
        'block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:outline-none focus:ring-2',
        errors?.length
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      ]"
    >
      <option value="" disabled hidden>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <div v-if="errors?.length" class="mt-1 text-sm text-red-600">
      {{ errors[0] }}
    </div>
  </div>
</template>
  
  <script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substring(2, 9)}`,
  },
  options: { type: Array, default: () => [] }, // [{ value: 'coffee', label: 'Coffee' }]
  placeholder: { type: String, default: "Please select" },
  errors: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
  