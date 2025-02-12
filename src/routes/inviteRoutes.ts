import express from 'express';
import { sendInvitation, acceptInvitation, rejectInvitation } from '../controllers/inviteController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/send', authenticateUser, sendInvitation);
router.post('/:invitationId/accept', authenticateUser, acceptInvitation);
router.post('/:invitationId/reject', authenticateUser, rejectInvitation);

export default router;