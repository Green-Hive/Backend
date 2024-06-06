import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import prisma from '../services/prisma.js';

export async function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  const {authorization, user} = req.headers;
  const token = process.env.USER_SECRET_TOKEN;

  console.log('USER_SECRET_TOKEN RECUS:', user);

  if (req.session && req.session.userId) return next();

  if (authorization) {
    try {
      const tokenMatch = await bcrypt.compare(token, authorization);

      console.log('Token match:', tokenMatch);
      if (tokenMatch) {
        try {
          res.locals.userInfo = await prisma.user.findUnique({
            where: {id: user as string},
            include: {hive: true},
          });
        } catch (error) {
          console.error('Error when fetching user from database', error);
        }
        return next();
      } else return res.status(401).json({message: 'Unauthorized - Invalid token'});
    } catch (error) {
      console.error('Error comparing tokens:', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
  } else return res.status(401).json({message: 'Unauthorized - User not logged in'});
}

export default checkAuthentication;
