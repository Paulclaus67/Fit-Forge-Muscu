// backend/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { setupDefaultProgram } from '../utils/setupDefaultProgram';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const authRouter = Router();

// POST /auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'email, username et password sont requis' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedEmail || !normalizedUsername || !password.trim()) {
      return res.status(400).json({ error: 'email, username et password sont requis' });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { username: normalizedUsername }] },
    });

    if (existing) {
      return res.status(400).json({ error: 'Email ou username déjà utilisé' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
      },
    });

    // Créer le programme par défaut pour le nouvel utilisateur
    await setupDefaultProgram(user.id);

    // Token direct après inscription
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: (user as any).profilePicture,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error('Error /auth/register', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return res
        .status(400)
        .json({ error: 'emailOrUsername et password sont requis' });
    }

    const identifier = emailOrUsername.trim().toLowerCase();

    if (!identifier || !password.trim()) {
      return res
        .status(400)
        .json({ error: 'emailOrUsername et password sont requis' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: (user as any).profilePicture,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error('Error /auth/login', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /auth/profile-picture - Mise à jour de la photo de profil
authRouter.put('/profile-picture', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const { profilePicture } = req.body;

    if (typeof profilePicture !== 'string') {
      return res.status(400).json({ error: 'profilePicture doit être une chaîne (base64 ou URL)' });
    }

    // Limite de taille : ~2MB en base64
    if (profilePicture.length > 3000000) {
      return res.status(400).json({ error: 'Image trop volumineuse (max ~2MB)' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { profilePicture } as any,
    });

    return res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicture: (updatedUser as any).profilePicture,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    console.error('Error /auth/profile-picture', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export { authRouter };
