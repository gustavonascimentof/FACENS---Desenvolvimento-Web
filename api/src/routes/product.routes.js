import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js'

const router = Router()

// Rotas públicas (qualquer um pode acessar)
router.get('/', getProducts)
router.get('/:id', getProductById)

// Rotas protegidas (só admin — middleware virá depois)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router