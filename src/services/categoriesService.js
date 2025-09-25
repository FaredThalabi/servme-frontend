import api from '@/utils/api.js'

export const categoriesService = {
  // Get all categories
  async getAll() {
    const response = await api.get('/v1/categories')
    return response.data
  },

  // Get category by ID
  async getById(id) {
    const response = await api.get(`/v1/categories/${id}`)
    return response.data
  },

  // Create new category
  async create(categoryData) {
    const response = await api.post('/v1/categories', categoryData)
    return response.data
  },

  // Update category
  async update(id, categoryData) {
    const response = await api.put(`/v1/categories/${id}`, categoryData)
    return response.data
  },

  // Delete category
  async delete(id) {
    const response = await api.delete(`/v1/categories/${id}`)
    return response.data
  },

  // Toggle category status (active/inactive)
  async toggleStatus(id) {
    const response = await api.patch(`/v1/categories/${id}/toggle-status`)
    return response.data
  }
}
