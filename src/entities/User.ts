


export enum UserRole {
  CLIENT = 'client',
  USER = 'user',
}


export interface IUser {
  _id?:string;
  username: string | null;
  email: string | null;
  password: string | null;
  bio?: string | null;
  dob?: Date | null;
  role: UserRole;
  image?: string | null;
  isActive: boolean | null;
  isVerified:boolean|null
  isBlock:boolean|null
  createdAt: Date | null;
  updatedAt: Date | null;
  location?: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  isPremium?: boolean;
  subscriptionId?: string
  twoFactorSecret: string
    twoFactorEnabled: boolean

 
}
