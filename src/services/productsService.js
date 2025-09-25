import api from '@/utils/api.js'

export const productsService = {
  // Get all products with optional filters
  async getAll(params = {}) {
    const response = await api.get('/v1/products', { params })
    return response.data
  },

  // Get product by ID
  async getById(id) {
    const response = await api.get(`/v1/products/${id}`)
    return response.data
  },

  // Create new product
  async create(productData) {
    const response = await api.post('/v1/products', productData)
    return response.data
  },

  // Update product
  async update(id, productData) {
    const response = await api.put(`/v1/products/${id}`, productData)
    return response.data
  },

  // Delete product
  async delete(id) {
    const response = await api.delete(`/v1/products/${id}`)
    return response.data
  },

  // Toggle product availability
  async toggleAvailability(id) {
    const response = await api.patch(`/v1/products/${id}/toggle-availability`)
    return response.data
  },

  // Upload product image
  async uploadImage(id, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post(`/v1/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
