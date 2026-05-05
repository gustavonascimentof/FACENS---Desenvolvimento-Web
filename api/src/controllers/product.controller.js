// product.controller.js
// Lógica das ações relacionadas a produtos

import Product from '../models/Product.model.js'

// GET /api/products — Lista todos os produtos disponíveis
export async function getProducts(req, res) {
  try {
    const products = await Product.find({ available: true })
    res.json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos' })
  }
}

// GET /api/products/:id — Busca um produto pelo ID
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar produto' })
  }
}

// POST /api/products — Cria um novo produto (admin)
export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// PUT /api/products/:id — Atualiza um produto (admin)
export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Retorna o documento atualizado
    )

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/products/:id — Remove um produto (admin)
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' })
    }

    res.json({ success: true, message: 'Produto removido com sucesso' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover produto' })
  }
}