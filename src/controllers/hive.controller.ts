import {Request, Response} from "express";
import prisma from "../services/prisma";

export const postHive = async (req: Request, res: Response) => {
  const {userId, title}: { userId: string, title: string } = req.body;

  try {
    const hive = await prisma.hive.create({
      data: {userId, title,},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
  /* #swagger.parameters['body'] = {
    in: 'body',
    schema: {
        userId: 'e0b0e7e0-1c5e-4b1e-9b0e-7e0e1c5e4b1e',
        title: 'my hive'
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
    console.error(error)
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
    return res.status(200).json(hive);
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
};

export const patchHive = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {title, description} = req.body;

  try {
    const hive = await prisma.hive.update({
      where: {id},
      data: {title, description},
    });
    return res.status(200).json(hive);
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
  /* #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     schema: {
         title: "my hive",
         description: 'my hive description'
     }
} */
};

export const deleteHive = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.hive.delete({where: {id}});
    res.status(200).send("Hive deleted");
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Hives']
}