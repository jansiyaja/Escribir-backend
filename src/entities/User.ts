

import { ObjectId } from 'mongoose';

export interface IUser {
  _id?:string;
  username: string | null;
  email: string | null;
  password: string | null;
  bio?: string | null;
  dob?: Date | null;
  role: 'client' | 'user' | null;
  image: string | null;
  isActive: boolean | null;
  isVerified:boolean|null
  createdAt: Date | null;
  updatedAt: Date | null;
}
