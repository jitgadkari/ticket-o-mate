import express from 'express';
import { createProject, getOrganizationProjects } from '../controllers/projectController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateUser, createProject);
router.get('/organization/:organizationId', authenticateUser, getOrganizationProjects);

export default router;