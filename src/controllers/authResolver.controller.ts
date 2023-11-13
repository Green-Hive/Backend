import {Request, Response} from 'express';

export const logout = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(404).json({message: 'User is not logged in'});
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({message: 'Error logging out'});
      } else {
        res.clearCookie('SESSION_ID');
        return res.status(200).json({message: 'Logout successful'});
      }
    });
  }
};