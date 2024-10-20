import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import Club from '../../../models/Club'
import User from '../../../models/User'
import { authMiddleware, roleMiddleware } from '../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect()

    switch (req.method) {
        case 'POST':
            return roleMiddleware(['student', 'teacher', 'staff', 'admin'])(async (req, res) => {
                try {
                    const { name, description, category, applicationDeadline } = req.body
                    const president = (req as any).user.id
                    const club = new Club({ name, description, category, president, applicationDeadline })
                    const createdClub = await club.save()
                    const user = await User.findByIdAndUpdate(president, { $push: { clubs: createdClub._id } }, { new: true })
                    res.status(201).json(createdClub)
                } catch (error: any) {
                    res.status(400).json({ message: error.message })
                }
            })(req, res)
        case 'GET':
            try {
                const clubs = await Club.find().populate('president', 'firstName lastName')
                res.status(200).json(clubs)
            } catch (error: any) {
                res.status(400).json({ message: error.message })
            }
            break
        default:
            res.status(405).json({ message: 'Method not allowed' })
    }
}

export default authMiddleware(handler)

