import mongoose, { Schema } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<User>('User', userSchema);