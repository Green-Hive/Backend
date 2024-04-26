
import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger/swagger.json' assert {type: 'json'};
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};

//INITIALIZE//
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions));

//MIDDLEWARES//

// ROUTES //
app.use('/api/users', userRoutes);
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
