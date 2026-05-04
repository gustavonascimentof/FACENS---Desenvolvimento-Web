// order.controller.js
// Lógica das ações relacionadas a pedidos

import Order from '../models/Order.model.js'

// POST /api/orders — Cria um novo pedido
export async function createOrder(req, res) {
  try {
    const { items, deliveryLocation, whatsapp } = req.body

    // Calcula o total somando preço * quantidade de cada item
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )

    const order = await Order.create({
      user: req.userId, // vem do middleware de autenticação
      items,
      totalPrice,
      deliveryLocation,
      whatsapp,
    })

    res.status(201).json({ success: true, data: order })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// GET /api/orders/my — Lista pedidos do usuário logado
export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .populate('items.product', 'name image') // Traz dados do produto

    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar pedidos' })
  }
}

// GET /api/orders — Lista todos os pedidos (admin)
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('items.product', 'name')

    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar pedidos' })
  }
}

// PATCH /api/orders/:id/status — Atualiza status do pedido (admin)
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}