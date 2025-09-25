<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your menu items</p>
      </div>
      <BaseButton @click="showCreateModal = true">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Product
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @input="debouncedSearch"
          />
        </div>
        <div class="min-w-48">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            v-model="filters.category_id"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="loadProducts"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="min-w-32">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            v-model="filters.is_available"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="loadProducts"
          >
            <option value="">All</option>
            <option value="1">Available</option>
            <option value="0">Unavailable</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm border animate-pulse">
        <div class="h-48 bg-gray-200 rounded-t-lg"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow-sm border p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first product.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <!-- Product Image -->
        <div class="h-48 bg-gray-100 relative">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute top-2 right-2">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                product.is_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ product.is_available ? 'Available' : 'Unavailable' }}
            </span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.category?.name }}</p>
              <p v-if="product.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
                {{ product.description }}
              </p>
            </div>
            <div class="text-right ml-4">
              <p class="text-lg font-bold text-gray-900">${{ product.price }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex items-center justify-between">
            <BaseButton
              variant="outline"
              size="sm"
              @click="toggleProductAvailability(product)"
              :loading="product.updating"
            >
              {{ product.is_available ? 'Mark Unavailable' : 'Mark Available' }}
            </BaseButton>
            
            <div class="flex space-x-2">
              <BaseButton
                variant="outline"
                size="sm"
                @click="editProduct(product)"
              >
                Edit
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                @click="confirmDelete(product)"
              >
                Delete
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal || showEditModal"
      :title="editingProduct ? 'Edit Product' : 'Create Product'"
      size="lg"
      @close="closeModal"
    >
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter product name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>

          <div>
            <label for="category_id" class="block text-sm font-medium text-gray-700">Category *</label>
            <select
              id="category_id"
              v-model="form.category_id"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id[0] }}</p>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product description"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">RM</span>
              </div>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price[0] }}</p>
          </div>

          <div>
            <label for="preparation_time" class="block text-sm font-medium text-gray-700">Prep Time (min)</label>
            <input
              id="preparation_time"
              v-model.number="form.preparation_time"
              type="number"
              min="0"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="15"
            />
            <p v-if="errors.preparation_time" class="mt-1 text-sm text-red-600">{{ errors.preparation_time[0] }}</p>
          </div>

          <div>
            <label for="sort_order" class="block text-sm font-medium text-gray-700">Sort Order</label>
            <input
              id="sort_order"
              v-model.number="form.sort_order"
              type="number"
              min="0"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0"
            />
            <p v-if="errors.sort_order" class="mt-1 text-sm text-red-600">{{ errors.sort_order[0] }}</p>
          </div>
        </div>

        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            id="image"
            ref="imageInput"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image[0] }}</p>
        </div>

        <div class="flex items-center">
          <input
            id="is_available"
            v-model="form.is_available"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_available" class="ml-2 block text-sm text-gray-900">Available for ordering</label>
        </div>
      </form>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="closeModal"
          class="mr-3"
        >
          Cancel
        </BaseButton>
        <BaseButton
          @click="submitForm"
          :loading="submitting"
        >
          {{ editingProduct ? 'Update' : 'Create' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="Delete Product"
      @close="showDeleteModal = false"
    >
      <div class="text-sm text-gray-500">
        <p>Are you sure you want to delete the product <strong>{{ productToDelete?.name }}</strong>?</p>
        <p class="mt-2 text-red-600">This action cannot be undone.</p>
      </div>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="showDeleteModal = false"
          class="mr-3"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="deleteProduct"
          :loading="deleting"
        >
          Delete
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { productsService } from '@/services/productsService.js'
import { categoriesService } from '@/services/categoriesService.js'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'

// Reactive data
const products = ref([])
const categories = ref([])
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Form data
const editingProduct = ref(null)
const productToDelete = ref(null)
const errors = ref({})
const imageInput = ref(null)
const selectedImage = ref(null)

// Filters
const filters = reactive({
  search: '',
  category_id: '',
  is_available: ''
})

const form = reactive({
  name: '',
  description: '',
  price: 0,
  category_id: '',
  preparation_time: 15,
  sort_order: 0,
  is_available: true
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 300)
}

// Methods
async function loadProducts() {
  try {
    loading.value = true
    const params = {}
    
    if (filters.search) params.search = filters.search
    if (filters.category_id) params.category_id = filters.category_id
    if (filters.is_available !== '') params.is_available = filters.is_available
    
    const response = await productsService.getAll(params)
    products.value = response.data || response
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const response = await categoriesService.getAll()
    categories.value = (response.data || response).filter(cat => cat.is_active)
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.price = 0
  form.category_id = ''
  form.preparation_time = 15
  form.sort_order = 0
  form.is_available = true
  selectedImage.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
  errors.value = {}
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  resetForm()
}

function editProduct(product) {
  editingProduct.value = product
  form.name = product.name
  form.description = product.description || ''
  form.price = product.price
  form.category_id = product.category_id
  form.preparation_time = product.preparation_time || 15
  form.sort_order = product.sort_order || 0
  form.is_available = product.is_available
  showEditModal.value = true
}

function confirmDelete(product) {
  productToDelete.value = product
  showDeleteModal.value = true
}

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
  }
}

async function submitForm() {
  try {
    submitting.value = true
    errors.value = {}

    let productData
    if (editingProduct.value) {
      // Update existing product
      productData = await productsService.update(editingProduct.value.id, { ...form })
    } else {
      // Create new product
      productData = await productsService.create({ ...form })
    }

    // Handle image upload if there's a selected image
    if (selectedImage.value && productData.id) {
      try {
        await productsService.uploadImage(productData.id, selectedImage.value)
      } catch (imageError) {
        console.error('Error uploading image:', imageError)
        // Continue even if image upload fails
      }
    }

    closeModal()
    await loadProducts()
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Error submitting form:', error)
    }
  } finally {
    submitting.value = false
  }
}

async function deleteProduct() {
  try {
    deleting.value = true
    await productsService.delete(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    await loadProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    deleting.value = false
  }
}

async function toggleProductAvailability(product) {
  try {
    product.updating = true
    await productsService.toggleAvailability(product.id)
    await loadProducts()
  } catch (error) {
    console.error('Error toggling product availability:', error)
  } finally {
    product.updating = false
  }
}

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories()
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
