import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json';
import userRoutes from "./routes/user.routes.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/users", userRoutes)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((_req, res) => res.status(404).json({error: "Not found"}));


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