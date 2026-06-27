import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function verify_jsontoken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined = undefined;

    if (req.cookies && req.cookies.login) {
      token = req.cookies.login;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Access Denied' });
      return;
    }
    const secretKey = process.env.JSONWEBTOKEN_KEY;
    if (!secretKey) {
      throw new Error('JSONWEBTOKEN_KEY is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err: unknown) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}
