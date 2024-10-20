import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  studentId?: string;
  teacherId?: string;
  department?: string;
  yearOfStudy?: number;
  clubs?: mongoose.Types.ObjectId[];
  events?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'staff', 'admin'], required: true },
  studentId: { type: String, sparse: true, unique: true },
  teacherId: { type: String, sparse: true, unique: true },
  department: String,
  yearOfStudy: Number,
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
