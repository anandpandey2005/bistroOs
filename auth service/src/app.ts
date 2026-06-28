import express, { Application, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';

// middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

//redirect routes
let timestamp: string = new Date().toLocaleString('en-in');
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'start',
    service: 'auth service',
    'time stamp': `${timestamp}`,
    'up time': `${process.uptime()}`,
    uuid: `${process.pid}`,
    'available memory': `${process.availableMemory()}`,
  });
});

export default app;
