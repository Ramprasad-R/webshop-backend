import express from 'express'
const router = express.Router()
import { createBrand, getBrands } from '../controllers/brandController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands).post(protect, admin, createBrand)

export default router
