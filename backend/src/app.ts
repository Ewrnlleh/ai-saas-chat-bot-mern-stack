import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import { cookie } from 'express-validator';
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan('dev'));

app.use("/api/v1", appRouter);

export default app;