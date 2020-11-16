import express from 'express'
const router = express.Router()
import {
  createBrand,
  deleteBrand,
  getBrands,
} from '../controllers/brandController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands).post(protect, admin, createBrand)
router.route('/:id').delete(protect, admin, deleteBrand)

export default router
