import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { reduceCountInStock } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { sendOrderEmail } from '../middleware/mailMiddleware.js'

router
  .route('/')
  .post(protect, addOrderItems, reduceCountInStock, sendOrderEmail)
  .get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router
