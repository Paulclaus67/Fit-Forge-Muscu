import { defineConfig } from 'prisma/config';
import Database from 'better-sqlite3';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'file:./prisma/dev.db',
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
});
