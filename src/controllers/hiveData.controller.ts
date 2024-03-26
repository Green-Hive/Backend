import {Request, Response} from 'express';
import prisma from '../services/prisma.js';

export const postData = async (req: Request, res: Response) => {
  const {hiveId, temp, hum, weight}: {
    hiveId: string,
    temp: number,
    hum: number,
    weight: number,
    inclination: number,
  } = req.body;

  try {
    const data = await prisma.hiveData.create({
      data: {hiveId, temp, hum, weight},
    });
    return res.status(200).json(data);
  } catch (error: any) {
    console.error(error);
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
    console.error(error);
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

    if (!data) return res.status(404).json({error: 'Hive not found.'});
    return res.status(200).json(data);
  } catch (error: any) {
    console.error(error);
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
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
};

export const deleteAllData = async (req: Request, res: Response) => {
  const {hiveId} = req.params;

  try {
    await prisma.hiveData.deleteMany({where: {hiveId}});
    res.status(200).json({message: 'All hive data deleted.'});
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['HiveData']
}