// productService.js
// Funções para buscar produtos na API

import api from './api.js'

// Busca todos os produtos disponíveis
export async function getProducts() {
  const response = await api.get('/products')
  return response.data.data // { success: true, data: [...] }
}

// Busca um produto pelo ID
export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data
}