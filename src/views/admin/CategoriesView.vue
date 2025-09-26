<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your menu categories</p>
      </div>
      <BaseButton @click="showCreateModal = true">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Category
      </BaseButton>
    </div>

    <!-- Categories Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="px-4 py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-500">Loading categories...</p>
      </div>

      <div v-else-if="categories.length === 0" class="px-4 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No categories</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first category.</p>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="category in categories" :key="category.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <div class="flex items-center">
                  <p class="text-sm font-medium text-gray-900">{{ category.name }}</p>
                  <span
                    :class="[
                      'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      category.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ category.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p v-if="category.description" class="text-sm text-gray-500">{{ category.description }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ category.products.length || 0 }} products
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <BaseButton
                variant="outline"
                size="sm"
                @click="toggleCategoryStatus(category)"
                :loading="category.updating"
              >
                {{ category.is_active ? 'Deactivate' : 'Activate' }}
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                @click="editCategory(category)"
              >
                Edit
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                @click="confirmDelete(category)"
                :disabled="category.products_count > 0"
              >
                Delete
              </BaseButton>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal || showEditModal"
      :title="editingCategory ? 'Edit Category' : 'Create Category'"
      @close="closeModal"
    >
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <BaseInput
            id="name"
            v-model="form.name"
            type="text"
            label="Name"
            placeholder="Enter category name"
            :errors="errors.name"
            class="mt-1"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <BaseTextArea
            id="description"
            v-model="form.description"
            :rows="3"
            placeholder="Enter category description (optional)"
            :error="errors.description ? errors.description[0] : ''"
            class="mt-1"
          />
        </div>

        <div>
          <BaseInput
            id="sort_order"
            v-model="form.sort_order"
            type="number"
            label="Sort Order"
            placeholder="0"
            :errors="errors.sort_order"
            class="mt-1"
          />
        </div>

        <div class="flex items-center">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      </form>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          @click="submitForm"
          :loading="submitting"
          class="mr-3"
        >
          {{ editingCategory ? 'Update' : 'Create' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="Delete Category"
      @close="showDeleteModal = false"
    >
      <div class="text-sm text-gray-500">
        <p>Are you sure you want to delete the category <strong>{{ categoryToDelete?.name }}</strong>?</p>
        <p class="mt-2 text-red-600">This action cannot be undone.</p>
      </div>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="showDeleteModal = false"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="deleteCategory"
          :loading="deleting"
          class="mr-3"
        >
          Delete
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { categoriesService } from '@/services/categoriesService.js'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseTextArea from '@/components/shared/BaseTextArea.vue'
import BaseInput from '@/components/shared/BaseInput.vue'

// Reactive data
const categories = ref([])
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Form data
const editingCategory = ref(null)
const categoryToDelete = ref(null)
const errors = ref({})

const form = reactive({
  name: '',
  description: '',
  sort_order: 0,
  is_active: true
})

// Methods
async function loadCategories() {
  try {
    loading.value = true
    const response = await categoriesService.getAll()
    categories.value = response.data || response
  } catch (error) {
    console.error('Error loading categories:', error)
    // You could add a toast notification here
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.sort_order = 0
  form.is_active = true
  errors.value = {}
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  resetForm()
}

function editCategory(category) {
  editingCategory.value = category
  form.name = category.name
  form.description = category.description || ''
  form.sort_order = category.sort_order || 0
  form.is_active = category.is_active
  showEditModal.value = true
}

function confirmDelete(category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

async function submitForm() {
  try {
    submitting.value = true
    errors.value = {}

    if (editingCategory.value) {
      // Update existing category
      await categoriesService.update(editingCategory.value.id, { ...form })
    } else {
      // Create new category
      await categoriesService.create({ ...form })
    }

    closeModal()
    await loadCategories()
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Error submitting form:', error)
      // You could add a toast notification here
    }
  } finally {
    submitting.value = false
  }
}

async function deleteCategory() {
  try {
    deleting.value = true
    await categoriesService.delete(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
    await loadCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    // You could add a toast notification here
  } finally {
    deleting.value = false
  }
}

async function toggleCategoryStatus(category) {
  try {
    // Add local loading state
    category.updating = true
    await categoriesService.update(category.id, { is_active: !category.is_active })
    await loadCategories()
  } catch (error) {
    console.error('Error toggling category status:', error)
    // You could add a toast notification here
  } finally {
    category.updating = false
  }
}

// Load categories on component mount
onMounted(() => {
  loadCategories()
})
</script>
