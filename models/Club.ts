import mongoose from 'mongoose'

export interface IClub extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  president: mongoose.Types.ObjectId;
  vicePresident: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  pendingMembers: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
  applicationOpen: boolean;
  applicationDeadline: Date;
  meetingSchedule: string;
  socialMediaLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new mongoose.Schema<IClub>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  president: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vicePresident: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  applicationOpen: { type: Boolean, default: true },
  applicationDeadline: { type: Date },
  meetingSchedule: String,
  socialMediaLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  tags: [String],
}, { timestamps: true })

export default mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema)
