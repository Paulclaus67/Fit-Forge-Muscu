// backend/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth';
import { workoutsRouter } from './routes/workouts';
import { exercisesRouter } from './routes/exercises';
import { weeklyPlanRouter } from './routes/weeklyPlan';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Augmenter la limite pour les photos de profil

// Routes simples de test
app.get('/', (req: Request, res: Response) => {
  res.send('API Muscu PWA – backend ok ✅');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Routes métier
app.use('/auth', authRouter);
app.use('/workouts', workoutsRouter);
app.use('/exercises', exercisesRouter);
app.use('/weekly-plan', weeklyPlanRouter);


const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
