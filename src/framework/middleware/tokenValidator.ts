import { Request,Response,NextFunction } from "express";
import jwt ,{JwtPayload} from 'jsonwebtoken'
import { UnauthorizedError,InvalidTokenError } from "../errors/customErrors";
import { logger } from "../services/logger";
import dotenv from 'dotenv';
dotenv.config()

const JWT_SECRET: string = process.env.JWT_SECRET as string;




export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  


    const tokenFromCookie = req.cookies.accessToken;

     const token =  tokenFromCookie; 
   
    
  
    if (token == null) return res.status(401).json({ error: 'Token is required' });

    try {
       
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!); 
       
        (req as any).user = decoded;
        next();
    } catch (error) {
       
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        next(new InvalidTokenError('An unexpected error occurred'));
    }
    
};



const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;



if (!refreshTokenSecret) {
    throw new Error('Refresh token secret not defined');
}

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new UnauthorizedError('Token is required'));
    }
      

    
    try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as CustomJwtPayload;
        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        next(new InvalidTokenError('An unexpected error occurred'));
    }
}

  export const authenticateAdminToken = (req: Request, res: Response, next: NextFunction) => {
        const tokenFromCookie = req.cookies.accessToken; 
        const token = tokenFromCookie;
    
        if (token == null) return res.status(401).json({ error: 'Token is required' });
    
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as CustomJwtPayload;
    
          
            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
    
          
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            next(new InvalidTokenError('An unexpected error occurred'));
        }
    };


