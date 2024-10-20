import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { generateToken } from '../../../utils/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  await dbConnect()

  const { email, password, firstName, lastName, role, studentId, teacherId, department, yearOfStudy } = req.body

  try {
    const user = await User.create({ 
      email, 
      password, 
      firstName, 
      lastName, 
      role,
      ...(studentId && { studentId }),
      ...(teacherId && { teacherId }),
      ...(department && { department }),
      ...(yearOfStudy && { yearOfStudy })
    })
    const token = generateToken(user)
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role
      } 
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
