// backend/src/routes/exercises.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../prismaClient';

const exercisesRouter = Router();

// GET /exercises
// Liste tous les exercices "templates" (ownerId = null)
exercisesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { ownerId: null },
      orderBy: { id: 'asc' },
      include: {
        muscles: true,
      },
    });

    return res.json(exercises);
  } catch (err) {
    console.error('Error GET /exercises', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /exercises/:id
exercisesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'id invalide' });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        muscles: true,
      },
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice introuvable' });
    }

    return res.json(exercise);
  } catch (err) {
    console.error('Error GET /exercises/:id', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export { exercisesRouter };
