import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Green Hive server !');
});

app.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error: any) {
    next(error.message);
  }
});

app.post('/posts', async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: { authorId: '7feacebe-4162-46bd-aab1-8a04aa42795a', ...req.body },
    });

    res.json(post);
  } catch (error: any) {
    console.log(error.message);

    next(error.message);
  }
});

app.get('/posts/:id', async (req, res, next) => {
  try {
    const posts = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    res.json(posts);
  } catch (error: any) {
    next(error.message);
  }
});

app.patch('/posts/:id', async (req, res, next) => {
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(post);
  } catch (error: any) {
    next(error.message);
  }
});

app.delete('/posts/:id', async (req, res, next) => {
  try {
    await prisma.post.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    next(error.message);
  }
});

app.get('/users/:id/posts', async (req, res, next) => {
  try {
    const userWithPosts = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        posts: {
          where: { published: true },
        },
      },
    });

    const posts = userWithPosts?.posts;

    res.json(posts);
  } catch (error: any) {
    next(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`====================================================`);
  console.log(`App listening on port ${process.env.PORT}`);
  console.log(`====================================================`);
});
