import api from '@/utils/api.js'

export const ordersService = {
  // Get all orders with optional filters
  async getAll(params = {}) {
    const response = await api.get('/orders', { params })
    return response.data
  },

  // Get order by ID
  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Update order status
  async updateStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  // Get order statistics
  async getStats(params = {}) {
    const response = await api.get('/orders/stats', { params })
    return response.data
  },

  // Cancel order
  async cancel(id, reason = '') {
    const response = await api.patch(`/orders/${id}/cancel`, { reason })
    return response.data
  },

  // Get order items
  async getOrderItems(id) {
    const response = await api.get(`/orders/${id}/items`)
    return response.data
  }
}
