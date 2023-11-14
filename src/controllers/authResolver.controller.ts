import {Request, Response} from 'express';
import prisma from "../services/prisma";
import {Provider} from "@prisma/client";

export const logout = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(404).json({message: 'User is not logged in'});
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({message: 'Error logging out'});
      } else {
        res.clearCookie('SESSION_ID');
        return res.status(200).json({message: 'Logout successful'});
      }
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const {email, password, name} = req.body;

  if (!email) return res.status(400).json({error: "Email is required."});
  if (name && name.length < 3) return res.status(400).json({error: "Name must be at least 3 characters long."});
  if (password && password.length < 3) return res.status(400).json({error: "Password must be at least 3 characters long."});

  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (existingUser) {
    if (existingUser.provider === Provider.GOOGLE && !existingUser.password) {
      const updatedUser = await prisma.user.update({
        where: {email},
        data: {
          password,
        },
      });

      req.session.userId = updatedUser.id;
      return res.status(200).json(updatedUser);
    } else {
      return res.status(400).json({error: "User already exists."});
    }
  } else {
    const user = await prisma.user.create({
      data: {name, email, password, provider: Provider.LOCAL},
    });
    
    req.session.userId = user.id;
    return res.status(200).json(user);
  }
};


//
// app.post('/login', async (req, res) => {
//   const {email, password} = req.body;
//
//   if (email && password) {
//     const user = await prisma.user.findUnique({where: {email}});
//     if (user && user.password === password) {
//       req.session.userId = user.id;
//       console.log("session", req.session)
//       return res.status(200).json(user);
//     } else {
//       return res.status(400).json({error: "Invalid credentials."});
//     }
//   } else res.status(400).json({error: "User not found."});
// });