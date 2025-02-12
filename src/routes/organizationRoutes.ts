import express from 'express'
import { 
	createOrganization, 
	getUserOrganizations 
} from '../controllers/organizationController'
import { authenticateUser } from '../middleware/authMiddleware'

const router = express.Router()

// Create and get organizations (requires authentication)
router.post('/', authenticateUser, createOrganization)
router.get('/', authenticateUser, getUserOrganizations)

export default router