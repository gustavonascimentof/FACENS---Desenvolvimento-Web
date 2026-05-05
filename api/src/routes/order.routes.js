import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

// Todas as rotas de pedido exigem login
router.use(authenticate)

router.post('/', createOrder)
router.get('/my', getMyOrders)
router.get('/', getAllOrders)
router.patch('/:id/status', updateOrderStatus)

export default router