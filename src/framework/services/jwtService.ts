import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
}

export const generateRefreshToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}