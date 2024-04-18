import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import * as Sentry from '@sentry/node';

export const postData = async (req: Request, res: Response) => {
  const {
    hiveId,
    temperature,
    humidity,
    weight,
    inclination,
  }: {
    hiveId: string;
    temperature: number;
    humidity: number;
    weight: number;
    inclination: boolean;
  } = req.body;

  try {
    const data = await prisma.hiveData.create({
      data: {hiveId, temperature, humidity, weight, inclination},
    });
    return res.status(200).json(data);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'postData'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        hiveId: 'e0b0e7e0-1c5e-4b1e-9b0e-7e0e1c5e4b1e',
        temp: 20,
        hum: 50,
        weight: 100,
        inclination: false,
    }
  } */
};

export const getAllData = async (req: Request, res: Response) => {
  const {hiveId} = req.params;

  try {
    const data = await prisma.hiveData.findMany({
      where: {hiveId},
      orderBy: {createdAt: 'desc'},
    });
    return res.status(200).json(data);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'getAllData'}});
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
};

export const getOneData = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const data = await prisma.hiveData.findUnique({
      where: {id},
    });

    if (!data) {
      Sentry.captureMessage('Hive not found.', {
        level: 'info',
        tags: {action: 'getOneData'},
      });
      return res.status(404).json({error: 'Hive not found.'});
    }
    return res.status(200).json(data);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'getOneData'}});
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
};

export const deleteData = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.hiveData.delete({where: {id}});
    res.status(200).json({message: 'Hive data deleted.', id});
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'deleteData'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
};

export const deleteAllData = async (req: Request, res: Response) => {
  const {hiveId} = req.params;

  if (!hiveId) {
    Sentry.captureMessage('Hive id is required.', {
      level: 'info',
      tags: {action: 'deleteAllData'},
    });
    return res.status(400).json({error: 'Hive id is required.'});
  }

  try {
    const deletedData = await prisma.hiveData.deleteMany({where: {hiveId}});
    if (deletedData.count === 0) {
      Sentry.captureMessage('No hive data found for the provided ID.', {
        level: 'info',
        tags: {action: 'deleteAllData'},
      });
      return res.status(404).json({error: 'No hive data found for the provided ID.'});
    }
    return res.status(200).json({message: 'All hive data deleted.', deletedCount: deletedData.count});
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'deleteAllData'}});
    return res.status(500).json({error: 'Internal server error.'});
  }
};
