// backend/src/prismaClient.ts
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: './prisma/dev.db' });

export const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'], // tu peux ajouter 'query' en dev si tu veux voir les requêtes
});
