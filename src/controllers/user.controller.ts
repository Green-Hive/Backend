import {Request, Response} from "express";
import prisma from "../services/prisma";

export const postUser = async (req: Request, res: Response) => {
  try {
    const {name, email}: { name: string, email: string } = req.body;
    const user = await prisma.user.create({
      data: {name, email,},
    });
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
      return res.status(400).json({error: "Email already exists."});
    } else {
      console.error(error);
      return res.status(400).json({error: error.message});
    }
  }
  // #swagger.tags = ['Users']
  /* #swagger.parameters['body'] = {
    in: 'body',
    schema: {
        name: 'my name',
        email: 'example@gmail.com'
    }
} */
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany(
      {
        orderBy: {createdAt: 'desc'},
      }
    );
    return res.status(200).json(users);
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({error: error.message});
  }
  // #swagger.tags = ['Users']
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const user = await prisma.user.findUnique({
      where: {id: id},
    });
    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
};

export const patchUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {name, email}: { name: string, email: string } = req.body;
    const user = await prisma.user.update({
      where: {id: id},
      data: {name, email},
    });
    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
  /* #swagger.parameters['body'] = {
     in: 'body',
     schema: {
         name: 'my name',
         email: 'example@gmail.com'
     }
} */
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await prisma.user.delete({where: {id}});
    res.status(200).send("User deleted");
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({error: error.message});
  }
  // #swagger.tags = ['Users']
}