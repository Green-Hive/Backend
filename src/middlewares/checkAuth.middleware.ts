import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import prisma from '../services/prisma.js';

export async function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  const {authorization, user} = req.headers;
  const token = process.env.USER_SECRET_TOKEN;

  console.log('authorization:', authorization);
  console.log('userIdFromIOT:', user);

  if (req.session && req.session.userId) {
    return next();
  }

  if (!authorization) {
    return res.status(401).json({message: 'Unauthorized - User not logged in'});
  }

  try {
    const tokenMatch = await bcrypt.compare(token, authorization);

    if (!tokenMatch) {
      return res.status(401).json({message: 'Unauthorized - Invalid token'});
    }

    const getUserInfo = await prisma.user.findUnique({
      where: {id: user as string},
      include: {hive: true},
    });

    if (!getUserInfo) {
      return res.status(401).json({message: 'Unauthorized - User not found'});
    }
    res.locals.userTokenInfo = getUserInfo;
    return next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
}

export default checkAuthentication;
