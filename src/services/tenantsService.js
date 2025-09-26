import api from '@/utils/api.js'

export const tenantsService = {
  async getById(id) {
    const response = await api.get(`/v1/tenants/${id}`)
    return response.data
  }
}