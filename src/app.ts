import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json';
import userRoutes from "./routes/user.routes.ts";
import hiveRoutes from "./routes/hive.routes.ts";
import authRoutes from "./routes/auth.routes.ts";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// app.use("/api/users", checkAuthentication, checkAuthorization, userRoutes);
// app.use("/api/hives", checkAuthentication, hiveRoutes);
// Routes

app.use("/api/users", userRoutes)
app.use("/api/hives", hiveRoutes)
app.use("/api/auth", authRoutes)
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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