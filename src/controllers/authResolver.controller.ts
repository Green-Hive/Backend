import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import {Provider} from '@prisma/client';
import bcrypt from 'bcrypt';
import * as Sentry from '@sentry/node';

export const getLoggedUser = async (req: Request, res: Response) => {
  try {
    const {userInfo} = res.locals;

    if (req.session.userId) {
      delete userInfo.password;
      return res.status(200).json({message: 'User is logged', userInfo});
    } else {
      Sentry.captureMessage('User is not logged', {
        level: 'info',
        tags: {action: 'getLoggedUser'},
      });
      return res.status(404).json({message: 'User is not logged', userInfo: null});
    }
  } catch (error) {
    Sentry.captureException(error, {tags: {action: 'getLoggedUser'}});
    return res.status(500).json({error: 'Failed to check logged-in status'});
  }
  // #swagger.tags = ['Auth']
};

export const register = async (req: Request, res: Response) => {
  try {
    const {email, password, name} = req.body;

    if (!email || !password || !name) {
      Sentry.captureMessage('Missing required registration fields', {
        level: 'info',
        tags: {action: 'Register'},
        extra: {
          email: email,
          name: name,
        },
      });
    }
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
      } else {
        Sentry.captureMessage('User already exists', {
          level: 'info',
          tags: {action: 'Register'},
        });
        return res.status(400).json({error: 'User already exists.'});
      }
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
  } catch (error) {
    Sentry.captureException(error, {tags: {action: 'register'}});
    return res.status(500).json({error: 'Failed to register user'});
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
  try {
    const {email, password} = req.body;

    if (req.session.userId) {
      return res.status(200).json({message: 'User is already logged in', userId: req.session.userId});
    }

    if (email && password) {
      const user = await prisma.user.findUnique({where: {email}});

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password || '');

        if (passwordMatch) {
          req.session.userId = user.id;
          delete user.password;
          return res.status(200).json(user);
        } else {
          Sentry.captureMessage('Invalid credentials.', {
            level: 'info',
            tags: {action: 'Login'},
            extra: {
              email: email,
            },
          });
          return res.status(400).json({error: 'Invalid credentials.'});
        }
      } else {
        Sentry.captureMessage('Missing required registration fields.', {
          level: 'info',
          tags: {action: 'Login'},
          extra: {
            email: email,
          },
        });
        return res.status(400).json({error: 'User not found.'});
      }
    } else {
      Sentry.captureMessage('Email and password are required.', {
        level: 'info',
        tags: {action: 'Login'},
      });
      return res.status(400).json({error: 'Email and password are required.'});
    }
  } catch (error) {
    Sentry.captureException(error, {tags: {action: 'login'}});
    return res.status(500).json({error: 'Failed to login user'});
  }
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
    Sentry.captureMessage('User is not logged in.', {
      level: 'info',
      tags: {action: 'Logout'},
    });
    return res.status(404).json({message: 'User is not logged in'});
  } else {
    req.session.destroy((err) => {
      if (err) {
        Sentry.captureException(err, {tags: {action: 'Logout'}});
        return res.status(500).json({message: 'Error logging out'});
      } else {
        res.clearCookie('SESSION');
        return res.status(200).json({message: 'Logout successful'});
      }
    });
  }
  // #swagger.tags = ['Auth']
};
