import {Request, Response} from 'express';
import prisma from '../services/prisma.js';
import {AlertSeverity, AlertType} from '@prisma/client';

type AlertPayload = {
  hiveId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
};

export const postAlert = async (req: Request, res: Response) => {
  const {hiveId, type, message, severity}: AlertPayload = req.body;

  try {
    const alert = await prisma.alert.create({
      data: {
        hiveId,
        type,
        severity,
        message,
      },
    });
    return res.status(200).json(alert);
  } catch (error: any) {
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Alerts']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'hiveId*, type*, message* : required',
    schema: {
      hiveId: 'e0b0e7e0-1c5e-4b1e-9b0e-7e0e1c5e4b1e',
      type: 'warning',
      message: 'Alert message',
      severity: 'high'
    }
  } */
};

export const getAllAlert = async (req: Request, res: Response) => {
  const {hiveId} = req.params;

  try {
    const data = await prisma.alert.findMany({
      where: {hiveId},
      orderBy: {createdAt: 'desc'},
    });
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Alerts']
};

export const patchAlert = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {type, severity, message} = req.body;

  try {
    const alert = await prisma.alert.update({
      where: {id},
      data: {type, severity, message},
    });
    return res.status(200).json(alert);
  } catch (error: any) {
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Alerts']
  /* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'type, severity, message : required',
    schema: {
      type: 'warning',
      message: 'Alert message',
      severity: 'high'
    }
  } */
};

export const deleteAlert = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.alert.delete({where: {id}});
    res.status(200).json({message: 'Alert deleted.', id});
  } catch (error: any) {
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Alerts']
};

export const deleteAllAlert = async (req: Request, res: Response) => {
  const {hiveId} = req.params;

  if (!hiveId) {
    return res.status(400).json({error: 'Alert id is required.'});
  }

  try {
    const deletedData = await prisma.alert.deleteMany({where: {hiveId}});
    if (deletedData.count === 0) {
      return res.status(404).json({error: 'No alerts found for the provided ID.'});
    }
    return res.status(200).json({message: 'All alerts deleted.', deletedCount: deletedData.count});
  } catch (error: any) {
    return res.status(500).json({error: 'Internal server error.'});
  }
  // #swagger.tags = ['Alerts']
};
