import {NextFunction, Request, Response} from 'express';
import prisma from '../services/prisma.js';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

async function getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {userId} = req.session;

  if (userId) {
    try {
      res.locals.userInfo = await prisma.user.findUnique({
        where: {id: userId},
        include: {hive: true},
      });
    } catch (error) {
      console.error('Error when fetching user from database', error);
    }
  }
  return next();
}

export default getCurrentUser;
