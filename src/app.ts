import 'dotenv/config';
import express from 'express';
import {PrismaClient} from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger.json';

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post('/users', async (req, res) => {
  try {
    const {name, email} = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.json(user);
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
      return res.status(400).json({error: "Email already exists."});
    } else {
      console.error(error);
      return res.status(500).json({error: error.message});
    }
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany(
      {
        orderBy: {createdAt: 'desc'},
      }
    );
    return res.json(users);
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({error: error.message});
  }
});


app.get('/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await prisma.user.findUnique({
      where: {id: id},
    });
    return res.json(user);
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({error: error.message});
  }
});

app.patch('/users/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const {name, email} = req.body;
    const user = await prisma.user.update({
      where: {id: id},
      data: {name, email},
    });
    return res.json(user);
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({error: error.message});
  }
});

app.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: {id: req.params.id},
    });
    res.json({message: 'User deleted successfully'});
  } catch (error: any) {
    next(error.message);
  }
});
//
// app.get('/users/:id/posts', async (req, res, next) => {
//   try {
//     const userWithPosts = await prisma.user.findUnique({
//       where: {id: req.params.id},
//       include: {
//         posts: {
//           where: {published: true},
//         },
//       },
//     });
//
//     const posts = userWithPosts?.posts;
//
//     res.json(posts);
//   } catch (error: any) {
//     next(error.message);
//   }
// });

export default app;