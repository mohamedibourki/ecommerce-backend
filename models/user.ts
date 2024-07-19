import mongoose, { Schema, Types } from 'mongoose';
import { Role } from './role';

interface User {
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId | Role;
  resetToken?: string;
  resetTokenExpires?: Date;
  emailToken?: string;
  isVerified?: boolean;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  emailToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model<User>('User', userSchema);
