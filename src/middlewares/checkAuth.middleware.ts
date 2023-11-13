import {NextFunction, Request, Response} from 'express';

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({message: 'Unauthorized - User not logged in'});
  }
}

export default checkAuthentication;