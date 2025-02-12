import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: any
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1] // Extract Bearer Token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) // Verify JWT
    req.user = decoded // Attach user data to request
    // console.log(req)
    next() // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
