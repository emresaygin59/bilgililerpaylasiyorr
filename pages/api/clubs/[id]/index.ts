import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/mongodb'
import Club from '../../../../models/Club'
import User from '../../../../models/User'
import { authMiddleware, roleMiddleware } from '../../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  switch (req.method) {
    case 'GET':
      try {
        const club = await Club.findById(id)
          .populate('president', 'firstName lastName')
          .populate('vicePresident', 'firstName lastName')
          .populate('members', 'firstName lastName')
          .populate('pendingMembers', 'firstName lastName')
          .populate('events')
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
          const { name, description, category, vicePresident, applicationOpen, applicationDeadline, meetingSchedule, socialMediaLinks, tags } = req.body
          const club = await Club.findById(id)
          if (!club) {
            return res.status(404).json({ message: 'Club not found' })
          }
          if (club.president.toString() !== (req as any).user.id) {
            return res.status(403).json({ message: 'Not authorized' })
          }
          
          Object.assign(club, {
            name: name || club.name,
            description: description || club.description,
            category: category || club.category,
            vicePresident: vicePresident || club.vicePresident,
            applicationOpen: applicationOpen !== undefined ? applicationOpen : club.applicationOpen,
            applicationDeadline: applicationDeadline || club.applicationDeadline,
            meetingSchedule: meetingSchedule || club.meetingSchedule,
            socialMediaLinks: { ...club.socialMediaLinks, ...socialMediaLinks },
            tags: tags || club.tags
          })

          await club.save()
          res.status(200).json(club)
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)

    case 'DELETE':
      return roleMiddleware(['admin'])(async (req, res) => {
        try {
          const deletedClub = await Club.findByIdAndDelete(id)
          if (!deletedClub) {
            return res.status(404).json({ message: 'Club not found' })
          }
          res.status(200).json({ message: 'Club deleted successfully' })
        } catch (error: any) {
          res.status(400).json({ message: error.message })
        }
      })(req, res)

    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)