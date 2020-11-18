import express from 'express'
const router = express.Router()
import {
  authUser,
  deleteUser,
  getUserProfile,
  getUsers,
  registerUser,
  updateUserProfile,
  getUserById,
  updateUser,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { welcomeEmail } from '../middleware/mailMiddleware.js'

router.route('/').post(welcomeEmail, registerUser).get(protect, admin, getUsers)

router.post('/login', authUser)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
