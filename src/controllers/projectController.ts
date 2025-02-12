import { Request, Response } from 'express';
import { prisma } from '../config/database';

export async function createProject(req: any, res: Response) {
	const { name, description, organizationId } = req.body;
	const userId = req.user?.user_metadata?.sub;

	try {
		// Check if user has permission in the organization
		const userOrg = await prisma.userOrganization.findUnique({
			where: {
				userId_organizationId: {
					userId,
					organizationId
				}
			}
		});

		if (!userOrg) {
			return res.status(403).json({ error: 'Not a member of this organization' });
		}

		const project = await prisma.project.create({
			data: {
				name,
				description,
				organizationId
			}
		});

		res.status(201).json(project);
	} catch (error) {
		console.error('Project creation error:', error);
		res.status(500).json({ error: 'Failed to create project' });
	}
}

export async function getOrganizationProjects(req: any, res: Response) {
	const { organizationId } = req.params;
	const userId = req.user?.user_metadata?.sub;

	try {
		// Verify user's membership in the organization
		const userOrg = await prisma.userOrganization.findUnique({
			where: {
				userId_organizationId: {
					userId,
					organizationId
				}
			}
		});

		if (!userOrg) {
			return res.status(403).json({ error: 'Not a member of this organization' });
		}

		const projects = await prisma.project.findMany({
			where: { organizationId },
			orderBy: { createdAt: 'desc' }
		});

		res.status(200).json(projects);
	} catch (error) {
		console.error('Fetching projects error:', error);
		res.status(500).json({ error: 'Failed to fetch projects' });
	}
}