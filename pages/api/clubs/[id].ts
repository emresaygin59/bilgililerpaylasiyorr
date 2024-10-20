import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import Club from '../../../models/Club'
import User from '../../../models/User'
import { authMiddleware, roleMiddleware } from '../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  switch (req.method) {
    case 'GET':
      try {
        const club = await Club.findById(id)
          .populate('president', 'firstName lastName')
          .populate('members', 'firstName lastName')
          .populate('pendingMembers', 'firstName lastName')
        if (!club) {
          return res.status(404).json({ message: 'Club not found' })
        }
        res.status(200).json(club)
      } catch (error: any) {
        res.status(400).json({ message: error.message })
      }
      break
    case 'PUT':
      return roleMiddleware(['student', 'teacher', 'staff', 'admin'])(async (req, res) => {
        try {
          const { name, description, category, applicationOpen, applicationDeadline } = req.body
          const club = await Club.findById(id)
          if (!club) {
            return res.status(404).json({ message: 'Club not found' })
          }
          if (club.president.toString() !== (req as any).user.id) {
            return res.status(403).json({ message: 'Not authorized' })
          }
          club.name = name || club.name
          club.description = description || club.description
          club.category = category || club.category
          club.applicationOpen = applicationOpen !== undefined ? applicationOpen : club.applicationOpen
          club.applicationDeadline = applicationDeadline || club.applicationDeadline
          await club.save()
          res.status(200).json(club)
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)
    case 'POST':
      return authMiddleware(async (req, res) => {
        try {
          const club = await Club.findById(id)
          if (!club) {
            return res.status(404).json({ message: 'Club not found' })
          }
          if (!club.applicationOpen || (club.applicationDeadline && new Date() > club.applicationDeadline)) {
            return res.status(400).json({ message: 'Club applications are closed' })
          }
          const userId = (req as any).user.id
          if (club.members.includes(userId) || club.pendingMembers.includes(userId)) {
            return res.status(400).json({ message: 'Already a member or application pending' })
          }
          club.pendingMembers.push(userId)
          await club.save()
          res.status(200).json({ message: 'Membership request sent' })
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)
