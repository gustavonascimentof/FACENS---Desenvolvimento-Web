// orderService.js
// Funções para gerenciar pedidos na API

import api from './api.js'

// Busca todos os pedidos (admin)
export async function getAllOrders() {
  const response = await api.get('/orders')
  return response.data.data
}

// Atualiza o status de um pedido
export async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/orders/${orderId}/status`, { status })
  return response.data.data
}

// Busca pedidos do usuário logado
export async function getMyOrders() {
  const response = await api.get('/orders/my')
  return response.data.data
}

// Cria um novo pedido
export async function createOrder(orderData) {
  const response = await api.post('/orders', orderData)
  return response.data.data
}