import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import * as Sentry from '@sentry/node';

export const postHive = async (req: Request, res: Response) => {
  const {
    userId,
    name,
    description,
  }: {
    userId: string;
    name: string;
    description: string;
  } = req.body;

  try {
    const hive = await prisma.hive.create({
      data: {userId, name, description},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      Sentry.captureMessage('Name already exists.', {
        level: 'info',
        tags: {action: 'postHive'},
      });
      return res.status(400).json({error: 'Name already exists.'});
    } else {
      Sentry.captureException(error, {tags: {action: 'postHive'}});
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

export const linkHiveToUser = async (req: Request, res: Response) => {
  const {hiveId, userId} = req.params;

  try {
    const hive = await prisma.hive.update({
      where: {id: hiveId},
      data: {userId},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'postHive'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: '(userId*, name* ) : required',
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
    Sentry.captureException(error, {tags: {action: 'getAllHives'}});
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const getUserAcessibleHives = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const hives = await prisma.hive.findMany({
      where: {userId, userHasAccess: true},
      orderBy: {createdAt: 'desc'},
    });
    return res.status(200).json(hives);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'getUserAcessibleHives'}});
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const getOneHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const hive = await prisma.hive.findUnique({
      where: {id},
    });

    if (!hive) return res.status(404).json({error: 'Hive not found.'});
    return res.status(200).json(hive);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'getOneHive'}});
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const getUserHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const hive = await prisma.hive.findMany({
      where: {userId: id},
      orderBy: {createdAt: 'desc'},
    });

    if (!hive) return res.status(404).json({error: 'Hive not found.'});
    return res.status(200).json(hive);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'getUserHive'}});
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
      Sentry.captureMessage('Name already taken.', {
        level: 'info',
        tags: {action: 'patchHive'},
      });
      return res.status(400).json({error: 'Name already taken.'});
    } else {
      Sentry.captureException(error, {tags: {action: 'patchHive'}});
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
    Sentry.captureException(error, {tags: {action: 'deleteHive'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const removeUserAccessToHive = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await prisma.hive.update({where: {id}, data: {userHasAccess: false}});
    res.status(200).json({message: 'Hive updated.', id});
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'removeUserAccessToHive'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const giveUserAccessToHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.hive.update({where: {id}, data: {userHasAccess: true}});
    res.status(200).json({message: 'Hive updated.', id});
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'giveUserAccessToHive'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};
