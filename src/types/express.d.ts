// src/types/express.d.ts
import { User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      User?: {
        id: string;
        email: string;
        name?: string;
      }
    }
  }
}

export {}