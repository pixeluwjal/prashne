// src/models/User.ts
import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string; // Password is now included
  role: 'hr' | 'candidate';
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' prevents password from being returned by default
  role: { type: String, enum: ['hr', 'candidate'], required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, select: false },
  verificationCodeExpires: { type: Date, select: false },
}, { timestamps: true });

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;