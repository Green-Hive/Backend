import {Request, Response} from 'express';
import prisma from '../services/prisma.js';

export const postHive = async (req: Request, res: Response) => {
  const {userId, name, description}: {
    userId: string,
    name: string,
    description: string,
  } = req.body;

  try {
    const hive = await prisma.hive.create({
      data: {userId, name, description},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      return res.status(400).json({error: 'Name already exists.'});
    } else {
      console.error(error);
      return res.status(400).json({error: error.message});
    }
  }
  // #swagger.tags = ['Hives']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'userId*, name* : required',
     schema: {
        userId: 'e0b0e7e0-1c5e-4b1e-9b0e-7e0e1c5e4b1e',
        name: 'my hive',
        description: 'my hive description',
    }
  } */

};

export const getAllHives = async (_req: Request, res: Response) => {
  try {
    const hives = await prisma.hive.findMany({
      orderBy: {createdAt: 'desc'},
    });
    return res.status(200).json(hives);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const getHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const hive = await prisma.hive.findUnique({
      where: {id},
    });

    if (!hive) return res.status(404).json({error: 'Hive not found.'});
    return res.status(200).json(hive);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const patchHive = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {name, description} = req.body;

  try {
    const hive = await prisma.hive.update({
      where: {id},
      data: {name, description},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      return res.status(400).json({error: 'Name already taken.'});
    } else {
      console.error(error);
      return res.status(400).json({error: error.message});
    }
  }
  // #swagger.tags = ['Hives']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        name: 'my hive',
        description: 'my hive description',
        data: '{}',
    }
  } */
};

export const deleteHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.hive.delete({where: {id}});
    res.status(200).json({message: 'Hive deleted.', id});
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};