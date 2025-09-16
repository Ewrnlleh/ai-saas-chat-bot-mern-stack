import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';

// Load environment variables from .env file
config();

const app = express();

// Middleware
app.use(express.json());

//remove it in production
app.use(morgan('dev'));

app.use("/api/v1", appRouter);

export default app;