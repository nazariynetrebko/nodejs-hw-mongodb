import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export const UsersCollection = model('user', usersSchema);
