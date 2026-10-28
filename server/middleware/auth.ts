import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../db/store.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_cinema_jwt_key_2025';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
  };
}

export function generateToken(payload: { _id: string; email: string; name: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      name: string;
      role: 'customer' | 'admin';
    };

    const user = dbStore.findUserById(decoded._id);
    if (!user) {
      res.status(401).json({ error: 'User account not found.' });
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied: Admin privileges required.' });
      return;
    }
    next();
  });
}
