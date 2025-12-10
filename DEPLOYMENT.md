# Deployment Guide

## Local development (docker compose)
- Prereqs: Docker + Docker Compose, `.env` filled from `.env.example`.
- Build and run: `docker compose up --build` (uses `docker-compose.yml`, exposes backend 4000, frontend 5173 with `VITE_API_URL=http://localhost:4000`).

## Production (VPS)
- Prereqs on server: Docker + Docker Compose, repo cloned (e.g., `/opt/Fit-Forge-Muscu`), `.env` with prod secrets, volume path `/opt/fitforge-data/dev.db` exists.
- Build images: `docker compose -f docker-compose.prod.yml build`
- Run services: `docker compose -f docker-compose.prod.yml up -d`
- Prisma migrations (when schema changes): `docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy`

## Domains / reverse proxy (reference)
- DNS: `fitforge-muscu.fr`, `www.fitforge-muscu.fr`, `api.fitforge-muscu.fr` → A → `193.70.84.47`.
- Caddy: proxy `fitforge-muscu.fr` → `127.0.0.1:5173`, `api.fitforge-muscu.fr` → `127.0.0.1:4000` (HTTPS via Let’s Encrypt).

## Images / Node version
- Both `backend/Dockerfile` and `frontend/Dockerfile` use `node:20-alpine` (required for Prisma/better-sqlite3).

## Environment variables
- See `.env.example`. In prod set `VITE_API_URL=https://api.fitforge-muscu.fr` and secure `JWT_SECRET`.

## Data persistence
- SQLite volume mounted in prod: `/opt/fitforge-data/dev.db:/app/dev.db`. Ensure host path exists and is backed up as needed.
