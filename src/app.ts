import {nodeProfilingIntegration} from '@sentry/profiling-node';
import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json' assert {type: 'json'};
import userRoutes from './routes/user.routes.js';
import hiveRoutes from './routes/hive.routes.js';
import authRoutes from './routes/auth.routes.js';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PgSession from 'connect-pg-simple';
import getCurrentUser from './middlewares/getCurrentUser.middleware.js';
import checkAuth from './middlewares/checkAuth.middleware.js';
import * as Sentry from '@sentry/node';

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};

Sentry.init({
  dsn: 'https://111e230f04e40176caf0e4e099808156@o4507072641695744.ingest.de.sentry.io/4507072722501712',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({tracing: true}),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({app}),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  environment: 'develop',
});

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
  })
);

//MIDDLEWARES//
app.use(getCurrentUser);

// ROUTES //
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hives', checkAuth, hiveRoutes);
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

//Sentry request handler
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + "\n");
// });

export default app;
