import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/mongodb'
import Club from '../../../../models/Club'
import User from '../../../../models/User'
import { authMiddleware, roleMiddleware } from '../../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  switch (req.method) {
    case 'POST': // Request to join
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

    case 'PUT': // Approve or reject membership
      return roleMiddleware(['student', 'teacher', 'staff', 'admin'])(async (req, res) => {
        try {
          const { userId, action } = req.body
          const club = await Club.findById(id)
          if (!club) {
            return res.status(404).json({ message: 'Club not found' })
          }
          if (club.president.toString() !== (req as any).user.id) {
            return res.status(403).json({ message: 'Not authorized' })
          }
          
          if (action === 'approve') {
            club.members.push(userId)
            club.pendingMembers = club.pendingMembers.filter((memberId) => memberId.toString() !== userId)
            await User.findByIdAndUpdate(userId, { : { clubs: club._id } })
          } else if (action === 'reject') {
            club.pendingMembers = club.pendingMembers.filter((memberId) => memberId.toString() !== userId)
          }

          await club.save()
          res.status(200).json({ message: `Membership ${action}d` })
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)

    case 'DELETE': // Leave club
      return authMiddleware(async (req, res) => {
        try {
          const userId = (req as any).user.id
          const club = await Club.findById(id)
          if (!club) {
            return res.status(404).json({ message: 'Club not found' })
          }
          
          club.members = club.members.filter((memberId) => memberId.toString() !== userId)
          await club.save()
          
          await User.findByIdAndUpdate(userId, { : { clubs: club._id } })
          
          res.status(200).json({ message: 'Left club successfully' })
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)

    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)
