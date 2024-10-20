import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local')
}

export function generateToken(user: IUser): string {
  return jwt.sign({ 
    id: user._id, 
    role: user.role,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET)
}

export function authMiddleware(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({ message: 'No token provided' })
      }

      const decoded = verifyToken(token)
      ;(req as any).user = decoded
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const user = (req as any).user
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' })
      }
      return handler(req, res)
    }
  }
}
