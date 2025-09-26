import api from '@/utils/api.js'

export const ordersService = {
  // Create new order
  async create(data) {
    const response = await api.post('/v1/orders', data)
    return response.data
  },
  
  // Mark order as paid (counter payments)
  async markPaid(id) {
    const response = await api.patch(`/v1/orders/${id}/pay`)
    return response.data
  },
  // Get all orders with optional filters
  async getAll(params = {}) {
    const response = await api.get('/v1/orders', { params })
    return response.data
  },

  // Get order by ID
  async getById(id) {
    const response = await api.get(`/v1/orders/${id}`)
    return response.data
  },

  // Update order status
  async updateStatus(id, status) {
    const response = await api.patch(`/v1/orders/${id}/status`, { status })
    return response.data
  },

  // Get order statistics
  async getStats(params = {}) {
    const response = await api.get('/v1/orders/stats', { params })
    return response.data
  },

  // Cancel order
  async cancel(id, reason = '') {
    const response = await api.patch(`/v1/orders/${id}/cancel`, { reason })
    return response.data
  },

  // Get order items
  async getOrderItems(id) {
    const response = await api.get(`/v1/orders/${id}/items`)
    return response.data
  }
}
