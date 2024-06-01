import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';

export async function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  const {authorization} = req.headers;
  const token = process.env.USER_SECRET_TOKEN;

  if (req.session && req.session.userId) return next();

  if (authorization) {
    console.log('Authorization header found');
    try {
      const tokenMatch = await bcrypt.compare(token, authorization);
      console.log('Token match:', tokenMatch);

      if (tokenMatch) return next();
      else return res.status(401).json({message: 'Unauthorized - Invalid token'});
    } catch (error) {
      console.error('Error comparing tokens:', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
  } else return res.status(401).json({message: 'Unauthorized - User not logged in'});
}

export default checkAuthentication;
