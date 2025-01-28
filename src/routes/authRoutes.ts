// src/routes/authRoutes.ts
import express from 'express'
import { signUp, signIn } from '../controllers/authController'
// import { authenticateUser } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
// router.get('/profile', authenticateUser, (req, res) => {
//   res.json({ user: req.user })
// })

export default router