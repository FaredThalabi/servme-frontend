<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      v-model="model"
      :placeholder="placeholder"
      :class="[
        'block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:outline-none focus:ring-2',
        errors?.length
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      ]"
    />
    <div v-if="errors?.length" class="mt-1 text-sm text-red-600">
      {{ errors[0] }}
    </div>
  </div>
</template>
  
  <script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`,
  },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  errors: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
  
  <style scoped>
/* Optional custom tweaks */
</style>
  