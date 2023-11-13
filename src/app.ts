import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json';
import userRoutes from "./routes/user.routes.ts";
import hiveRoutes from "./routes/hive.routes.ts";
import authRoutes from "./routes/auth.routes.ts";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import PgSession from 'connect-pg-simple';
import getCurrentUser from "./middlewares/getCurrentUser.middleware.ts";

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

//INITIALIZE//
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  session({
    name: 'SESSION',
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: new (PgSession(session))({
      conString: process.env.DATABASE_URL,
      tableName: 'Session',
      pruneSessionInterval: 60, // 1 min
      // pruneSessionInterval: 3600, // delete expired sessions every 1 h
    }),
    cookie: {
      secure: false,
      maxAge: 60000, // 1 min
      // maxAge: 7200000, // 2 h
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "lax",
    },
  })
);

//MIDDLEWARES//
app.use(getCurrentUser);
// app.use("/api/users", checkAuthentication, checkAuthorization, userRoutes);
// app.use("/api/hives", checkAuthentication, hiveRoutes);
app.get('/me', (req, res) => {
  const {userInfo} = res.locals;

  console.log("session=", req.session, "\n")
  console.log("locals=", res.locals, "\n")
  console.log("=====================================")

  if (req.session.userId) {
    const userId = req.session.userId;
    res.status(200).json({message: "User is logged", userId, userInfo});
  } else {
    res.status(404).json({message: "User is not logged"});
  }
});

// ROUTES //
app.use("/api/users", userRoutes)
app.use("/api/hives", hiveRoutes)
app.use("/api/auth", authRoutes)
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;