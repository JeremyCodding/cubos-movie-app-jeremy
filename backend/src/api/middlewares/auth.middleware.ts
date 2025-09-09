import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include the 'user' property
interface AuthRequest extends Request {
  user?: { userId: number };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  // Verify the token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server error: JWT secret not configured.' });
  }

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    // If token is valid, attach the decoded payload to the request object
    req.user = { userId: decoded.userId };

    // Pass control to the next middleware or controller
    next();
  });
};