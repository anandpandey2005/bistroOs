import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtUserPayload {
  id: string;
  email: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export function verify_jsontoken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const secretKey = process.env.JSONWEBTOKEN_KEY;
  if (!secretKey) {
    console.error('CRITICAL CONFIG ERROR: JSONWEBTOKEN_KEY is missing from environment variables.');
    res.status(500).json({ message: 'Internal server configuration error' });
    return;
  }

  try {
    let token: string | undefined = undefined;

    if (req.cookies?.login) {
      token = req.cookies.login;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Access Denied: Token missing' });
      return;
    }

    const decoded = jwt.verify(token, secretKey) as JwtUserPayload;

    req.user = decoded;

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
      return;
    }

    res.status(403).json({ message: 'Invalid token signature' });
  }
}
