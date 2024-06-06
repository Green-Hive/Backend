import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import * as Sentry from '@sentry/node';
import {checkAlerts} from '../services/alertsHandler.js';

export type HiveDataPayload = {
  hiveId: string;
  time: number;
  tempBottomLeft?: number;
  tempTopRight?: number;
  tempOutside?: number;
  pressure?: number;
  humidityBottomLeft?: number;
  humidityTopRight?: number;
  humidityOutside?: number;
  weight?: number;
  magnetic_x?: number;
  magnetic_y?: number;
  magnetic_z?: number;
};

export const postData = async (req: Request, res: Response) => {
  const user = res.locals.userTokenInfo;
  const {
    hiveId,
    time,
    tempBottomLeft,
    tempTopRight,
    tempOutside,
    pressure,
    humidityBottomLeft,
    humidityTopRight,
    humidityOutside,
    weight,
    magnetic_x,
    magnetic_y,
    magnetic_z,
  }: HiveDataPayload = req.body;

  try {
    const data = await prisma.hiveData.create({
      data: {
        hiveId,
        time,
        tempBottomLeft,
        tempTopRight,
        tempOutside,
        pressure,
        humidityBottomLeft,
        humidityTopRight,
        humidityOutside,
        weight,
        magnetic_x,
        magnetic_y,
        magnetic_z,
      },
    });
    checkAlerts(data, user);
    return res.status(200).json(data);
  } catch (error: any) {
    Sentry.captureException(error, {tags: {action: 'postData'}});
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: '(hiveId*, time*) : required',
    schema: {
      hiveId: 'e0b0e7e0-1c5e-4b1e-9b0e-7e0e1c5e4b1e',
      time: 1630000000,
      tempBottomLeft: 20,
      tempTopRight: 20,
      tempOutside: 20,
      pressure: 1000,
      humidityBottomLeft: 50,
      humidityTopRight: 50,
      humidityOutside: 50,
      weight: 1000,
      magnetic_x: 100,
      magnetic_y: 100,
      magnetic_z: 100,
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
  // #swagger.tags = ['HiveData']
};
