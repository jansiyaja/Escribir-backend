import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError, InvalidTokenError } from '../errors/customErrors';

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
export const authenticateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {  
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    
    res.status(401).json({ error: 'Token is required' });
    return; 
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as CustomJwtPayload;
    (req as any).user = decoded; 
    next(); 
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
     
      res.status(403).json({ error: 'Invalid refresh token' });
      return; 
    }
   
    next(new InvalidTokenError('An unexpected error occurred'));
  }
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tokenFromCookie = req.cookies.accessToken; 
  const token = tokenFromCookie;

  if (!token) {
   
    res.status(401).json({ error: 'Token is required' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!); 
    (req as any).user = decoded; 
      next();
  } catch (error) {
   
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
      return; 
    }

   
    next(new InvalidTokenError('An unexpected error occurred'));
  }
};

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


