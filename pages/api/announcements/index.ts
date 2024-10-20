import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Announcement from '../../../models/Announcement';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const announcements = await Announcement.find({}).populate('author', 'name').populate('club', 'name');
        res.status(200).json({ success: true, data: announcements });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const user = await verifyToken(req);
        if (!user) {
          return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const announcement = await Announcement.create({ ...req.body, author: user._id });
        res.status(201).json({ success: true, data: announcement });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
