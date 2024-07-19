import mongoose, { Schema } from 'mongoose';

interface Role {
  name: string;
}

const roleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

export default mongoose.model<Role>('Role', roleSchema);
export { Role };