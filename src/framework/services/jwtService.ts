import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const generateAccessToken = (userId: ObjectId, role: string): string => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
}

export const generateRefreshToken = (userId: ObjectId, role: string): string => {
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}