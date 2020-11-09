import express from 'express'
const router = express.Router()
import {
  createCategories,
  createDepartment,
  deleteCategory,
  deleteDepartment,
  getdepartmentById,
  getDepartments,
} from '../controllers/departmentController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').get(getDepartments).post(protect, admin, createDepartment)
router
  .route('/:id/categories')
  .post(protect, admin, createCategories)
  .put(protect, admin, deleteCategory)
router
  .route('/:id')
  .get(getdepartmentById)
  .delete(protect, admin, deleteDepartment)

export default router
