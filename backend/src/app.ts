import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://esic.rioclarorj.govdigital.app.br',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
