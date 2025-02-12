import { Request, Response } from 'express';
import { prisma } from '../config/database';

export async function sendInvitation(req: any, res: Response) {
	const { email, organizationId } = req.body;
	const userId = req.user?.user_metadata?.sub;

	try {
		// Check if user has permission to invite
		const userOrg = await prisma.userOrganization.findUnique({
			where: {
				userId_organizationId: {
					userId,
					organizationId
				}
			}
		});

		if (!userOrg || !['ADMIN', 'OWNER'].includes(userOrg.role)) {
			return res.status(403).json({ error: 'Not authorized to send invitations' });
		}

		// Check if invitation already exists
		const existingInvite = await prisma.invitation.findFirst({
			where: {
				email,
				organizationId,
				status: 'PENDING'
			}
		});

		if (existingInvite) {
			return res.status(400).json({ error: 'Invitation already sent' });
		}

		const invitation = await prisma.invitation.create({
			data: {
				email,
				organizationId
			}
		});

		// TODO: Send email to invited user

		res.status(201).json(invitation);
	} catch (error) {
		console.error('Invitation error:', error);
		res.status(500).json({ error: 'Failed to send invitation' });
	}
}

export async function acceptInvitation(req: any, res: Response) {
	const { invitationId } = req.params;
	const userId = req.user?.user_metadata?.sub;

	try {
		const invitation = await prisma.invitation.findUnique({
			where: { id: invitationId }
		});

		if (!invitation || invitation.status !== 'PENDING') {
			return res.status(400).json({ error: 'Invalid or expired invitation' });
		}

		await prisma.$transaction([
			prisma.userOrganization.upsert({
				where: {
					userId_organizationId: {
						userId,
						organizationId: invitation.organizationId
					}
				},
				update: {}, // No update required if entry exists
				create: {
					userId,
					organizationId: invitation.organizationId,
					role: 'USER'
				}
			}),
			prisma.invitation.update({
				where: { id: invitationId },
				data: { status: 'ACCEPTED' }
			})
		]);

		res.status(200).json({ message: 'Invitation accepted successfully' });
	} catch (error) {
		console.error('Accept invitation error:', error);
		res.status(500).json({ error: 'Failed to accept invitation' });
	}
}

export async function rejectInvitation(req: any, res: Response) {
	const { invitationId } = req.params;

	try {
		await prisma.invitation.update({
			where: { id: invitationId },
			data: { status: 'REJECTED' }
		});

		res.status(200).json({ message: 'Invitation rejected successfully' });
	} catch (error) {
		console.error('Reject invitation error:', error);
		res.status(500).json({ error: 'Failed to reject invitation' });
	}
}