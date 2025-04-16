import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { InvalidTokenError } from '../errors/customErrors';
import { generateAccessToken } from '../services/jwtService';
import { ObjectId } from 'mongoose';


const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
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






export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!tokenFromCookie) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        console.error('Access and Refresh tokens are missing');
        res.status(401).json({ error: 'Access and Refresh tokens are required' });
        return;
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as { userId: ObjectId; role: string };

        const newAccessToken = generateAccessToken(decodedRefreshToken.userId, decodedRefreshToken.role);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        (req as any).user = decodedRefreshToken;

        console.info('New access token generated from refresh token');
        return next();
      } catch (error) {
        console.error('Invalid refresh token', error);
        res.status(403).json({ error: 'Invalid refresh token' });
        return;
      }
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
      role: string;
    };

    // Log the user's role
    console.info(`User role: ${decoded.role}`);

    // Role check - Allowing 'admin', 'client', or 'user' roles
    if (decoded.role === 'admin') {
      // Allow access for admins
      console.info('Access granted: Admin');
    } else if (decoded.role === 'client') {
      // Allow access for clients
      console.info('Access granted: Client');
    } else if (decoded.role === 'user') {
      // Allow access for regular users
      console.info('Access granted: User');
    } else {
      console.error('Access denied: insufficient role');
      res.status(403).json({ error: 'Access denied: insufficient role' });
      return;
    }

    // Attach the decoded user information to the request object
    (req as any).user = decoded;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Access token invalid or expired');
      res.status(401).json({ error: 'Invalid or expired access token' });
      return;
    }

    console.error('Unexpected error in token authentication', error);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};





export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tokenFromCookie = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

      if (!tokenFromCookie) {
        res.status(401).json({ error: 'Access token is required' });
      }

      const decoded = jwt.verify(tokenFromCookie, process.env.ACCESS_TOKEN_SECRET!) as {
        userId: string;
        role: string;
      };

      // Log the role of the user for debugging purposes
      console.info(`User role: ${decoded.role}`);

      // Check if the user's role matches any of the allowed roles
      if (roles.includes(decoded.role)) {
        (req as any).user = decoded; // Attach user data to the request
        return next();
      }

      // If the role is not allowed, deny access
      console.error('Access denied: insufficient role');
      res.status(403).json({ error: 'Access denied: insufficient role' });
    } catch (error) {
      console.error('Error verifying token', error);
      res.status(401).json({ error: 'Invalid or expired access token' });
    }
  };
};



interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string;
  role: string;
}

export const authenticateAdminToken = (
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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as CustomJwtPayload;

  
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

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



