import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json' assert {type: "json"};
import userRoutes from './routes/user.routes.js';
import hiveRoutes from './routes/hive.routes.js';
import authRoutes from './routes/auth.routes.js';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PgSession from 'connect-pg-simple';
import getCurrentUser from './middlewares/getCurrentUser.middleware.js';
import checkAuth from './middlewares/checkAuth.middleware.js';

const app = express();
const corsOptions = {
  origin: "*",
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new (PgSession(session))({
      conString: process.env.DATABASE_URL,
      tableName: 'Session',
      pruneSessionInterval: 60, // 1 min
    }),
    cookie: {
      secure: false,
      // maxAge: 60000, // 1 min
      maxAge: 7200000, // 1 h
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    },
  }),
);

//MIDDLEWARES//
app.use(getCurrentUser);

// ROUTES //
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hives', checkAuth, hiveRoutes);
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;