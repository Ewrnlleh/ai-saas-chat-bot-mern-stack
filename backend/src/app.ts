import express from 'express';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const app = express();

// Middleware
app.use(express.json());

export default app;