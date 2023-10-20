import 'dotenv/config';
import express from 'express';
import {PrismaClient} from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (_req, res) => {
  res.send('Welcome to Green Hive server !');
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
    console.log(error.message);
    return res.status(503);
  }
});

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
    } catch (error: any) {
      console.log(error.message);
      return res.status(400);
    }
  }
);


//
// app.get('/posts/:id', async (req, res, next) => {
//   try {
//     const posts = await prisma.post.findUnique({
//       where: {id: req.params.id},
//     });
//
//     res.json(posts);
//   } catch (error: any) {
//     next(error.message);
//   }
// });
//
// app.patch('/posts/:id', async (req, res, next) => {
//   try {
//     const post = await prisma.post.update({
//       where: {id: req.params.id},
//       data: req.body,
//     });
//
//     res.json(post);
//   } catch (error: any) {
//     next(error.message);
//   }
// });
//
// app.delete('/posts/:id', async (req, res, next) => {
//   try {
//     await prisma.post.delete({
//       where: {id: req.params.id},
//     });
//     res.json({message: 'Post deleted successfully'});
//   } catch (error: any) {
//     next(error.message);
//   }
// });
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

app.listen(process.env.PORT, () => {
  console.log(`====================================================`);
  console.log(`App listening on port ${process.env.PORT}`);
  console.log(`====================================================`);
});
