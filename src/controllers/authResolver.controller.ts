import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import {Provider} from '@prisma/client';
import bcrypt from 'bcrypt';

export const getLoggedUser = async (req: Request, res: Response) => {
  const {userInfo} = res.locals;


  if (req.session.userId) {
    const {password, ...userInfoWithoutPassword} = userInfo;
    return res.status(200).json({message: 'User is logged', userInfo: userInfoWithoutPassword});
  } else {
    return res.status(404).json({message: 'User is not logged', userInfo: null});
  }
  // #swagger.tags = ['Auth']
}

export const register = async (req: Request, res: Response) => {
  const {email, password, name} = req.body;

  if (!email) return res.status(400).json({error: 'Email is required.'});
  if (!name || name.length < 3) return res.status(400).json({error: 'Name must be at least 3 characters long.'});
  if (!password || password.length < 3) return res.status(400).json({error: 'Password must be at least 3 characters long.'});

  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (existingUser) {
    if (existingUser.provider === Provider.GOOGLE && !existingUser.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: {email},
        data: {
          password: hashedPassword,
        },
      });
      req.session.userId = updatedUser.id;
      return res.status(200).json(updatedUser);
    } else
      return res.status(400).json({error: 'User already exists.'});

  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: Provider.LOCAL,
      },
    });

    req.session.userId = user.id;
    return res.status(200).json(user);
  }
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'name*, email* , password*: required',
    schema: {
        email: 'example@gmail.com',
        password: '****',
        name: 'John Doe',
    }
} */
};

export const login = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  if (req.session.userId) {
    return res.status(200).json({ message: 'User is already logged in', userId: req.session.userId });
  }

  if (email && password) {
    const user = await prisma.user.findUnique({where: {email}});

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password || '');

      if (passwordMatch) {
        req.session.userId = user.id;
        return res.status(200).json(user.id);
      } else return res.status(400).json({error: 'Invalid credentials.'});

    } else return res.status(400).json({error: 'User not found.'});

  } else return res.status(400).json({error: 'Email and password are required.'});
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'email* , password*: required',
    schema: {
        email: 'example@gmail.com',
        password: '****',
    }
} */
};

export const logout = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(404).json({message: 'User is not logged in'});
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({message: 'Error logging out'});
      } else {
        res.clearCookie('SESSION');
        return res.status(200).json({message: 'Logout successful'});
      }
    });
  }
  // #swagger.tags = ['Auth']
};