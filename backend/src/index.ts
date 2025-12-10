// backend/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth';
import { workoutsRouter } from './routes/workouts';
import { exercisesRouter } from './routes/exercises';
import { weeklyPlanRouter } from './routes/weeklyPlan';

dotenv.config();

// Vérification des variables d'environnement critiques en production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-me') {
    throw new Error('JWT_SECRET must be set to a strong secret in production');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in production');
  }
}

const app = express();

// Sécurité : Helmet pour les headers HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour permettre les inline scripts (PWA)
  crossOriginEmbedderPolicy: false,
}));

// CORS configuré selon l'environnement
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins
    : true, // En dev, accepter toutes les origines
  credentials: true,
}));

// Rate limiting : limite de requêtes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par fenêtre
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting plus strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion max
  message: { error: 'Trop de tentatives de connexion, réessayez dans 15 minutes' },
  skipSuccessfulRequests: true,
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
app.use(limiter);

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


// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  // Ne pas exposer les détails d'erreur en production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Une erreur est survenue' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

const PORT = process.env.PORT ?? 4000;

const server = app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`✅ Backend running on port ${PORT} (${env})`);
  if (env === 'production') {
    console.log('🔒 Production mode: Security features enabled');
  }
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
