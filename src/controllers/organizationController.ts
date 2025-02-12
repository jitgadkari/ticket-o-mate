import { Request, Response } from 'express'
import { prisma } from '../config/database'

export async function createOrganization(req: any, res: Response) {
  console.log(req)
    const { name } = req.body
    const userId = req.user?.user_metadata?.sub

    if (!userId) {
        return res.status(401).json({ error: 'User must be authenticated' })
    }

    try {
        // Create organization with owner and UserOrganization entry
        const organization = await prisma.organization.create({
            data: {
                name,
                ownerId: userId,
                users: {
                    create: {
                        userId,
                        role: 'OWNER'
                    }
                }
            },
            include: {
                users: true
            }
        })

        res.status(201).json(organization)
    } catch (error) {
        console.error('Organization creation error:', error)
        res.status(500).json({ error: 'Failed to create organization' })
    }
}

export async function getUserOrganizations(req: any, res: Response) {

    const userId = req.user?.user_metadata?.sub

    if (!userId) {
        return res.status(401).json({ error: 'User must be authenticated' })
    }

    try {
        const organizations = await prisma.userOrganization.findMany({
            where: { userId },
            include: {
                organization: true
            }
        })

        res.status(200).json(organizations.map(org => org.organization))
    } catch (error) {
        console.error('Fetching organizations error:', error)
        res.status(500).json({ error: 'Failed to fetch organizations' })
    }
}