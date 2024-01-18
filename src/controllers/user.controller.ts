import {Request, Response} from 'express';
import prisma from '../services/prisma';
import {Provider} from '@prisma/client';
import bcrypt from 'bcrypt';

export const postUser = async (req: Request, res: Response) => {
  const {name, email, id, password}: {name: string, email: string, id: string, password: string} = req.body;

  if (!password) return res.status(400).json({error: 'Password is required.'});
  if (password && password.length < 3) return res.status(400).json({error: 'Password must be at least 3 characters long.'});

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: Provider.LOCAL,
      },
    });
    return res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
      return res.status(400).json({error: 'Email already exists.'});
    } else {
      console.error(error);
      return res.status(400).json({error: error.message});
    }
  }
  // #swagger.tags = ['Users']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'name*, email* , password*: required',
    schema: {
        name: 'my name',
        email: 'example@gmail.com',
        password: '****',
    }
} */
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {createdAt: 'desc'},
    });
    return res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Users']
};

export const getUser = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {id},
    });
    if (!user) return res.status(404).json({error: 'User not found'});
    else
      return res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
};

export const patchUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {name, email, password, notified}: {
    name: string,
    email: string,
    password: string,
    notified: boolean
  } = req.body;
  let hashedPassword;

  if (password && password.length < 3) return res.status(400).json({error: 'Password must be at least 3 characters long.'});
  if (password) hashedPassword = await bcrypt.hash(password, 10);

  try {

    const user = await prisma.user.update({
      where: {id: id},
      data: {name, email, password: hashedPassword, notified},
    });
    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
  /* #swagger.parameters['body'] = {
     in: 'body',
      required: true,
     schema: {
         name: 'my name',
         email: 'example@gmail.com',
         password: '****',
     }
} */
};

export const deleteUser = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.user.delete({where: {id}});
    res.status(200).json({message: 'User deleted', id});
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
};