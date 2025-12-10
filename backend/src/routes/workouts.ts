// backend/src/routes/workouts.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { authRequired, AuthRequest } from '../middleware/auth';
import { WorkoutType } from '@prisma/client';

const workoutsRouter = Router();

/**
 * GET /workouts
 * -> séances "globales" (templates : ownerId = null)
 */
workoutsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { ownerId: null },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        isPublic: true,
      },
    });

    return res.json(workouts);
  } catch (err) {
    console.error('Error GET /workouts', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /workouts/mine
 * -> séances perso de l’utilisateur
 */
workoutsRouter.get(
  '/mine',
  authRequired,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const workouts = await prisma.workout.findMany({
        where: { ownerId: userId },
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          isPublic: true,
        },
      });

      return res.json(workouts);
    } catch (err) {
      console.error('Error GET /workouts/mine', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * GET /workouts/:id
 * -> détail d’une séance (template ou perso)
 */
workoutsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: {
              include: {
                muscles: true,
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return res.status(404).json({ error: 'Séance introuvable' });
    }

    return res.json(workout);
  } catch (err) {
    console.error('Error GET /workouts/:id', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /workouts/:id/clone
 * -> cloner un template pour l’utilisateur connecté
 */
workoutsRouter.post(
  '/:id/clone',
  authRequired,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

      const template = await prisma.workout.findUnique({
        where: { id },
        include: {
          exercises: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!template) {
        return res.status(404).json({ error: 'Séance introuvable' });
      }

      // Optionnel : empêcher de cloner une séance déjà perso
      if (template.ownerId !== null) {
        return res
          .status(400)
          .json({ error: 'Cette séance est déjà une séance personnalisée' });
      }

      const newName =
        (req.body?.name as string | undefined) ||
        `${template.name} (perso)`;

      const cloned = await prisma.workout.create({
        data: {
          name: newName,
          description: template.description,
          type: template.type,
          isPublic: false,
          ownerId: userId,
          exercises: {
            create: template.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              order: e.order,
              sets: e.sets,
              reps: e.reps,
              durationSec: e.durationSec,
              restSec: e.restSec,
              notes: e.notes,
              circuitIndex: e.circuitIndex,
              circuitOrder: e.circuitOrder,
            })),
          },
        },
        include: {
          exercises: {
            orderBy: { order: 'asc' },
            include: {
              exercise: true,
            },
          },
        },
      });

      return res.status(201).json(cloned);
    } catch (err) {
      console.error('Error POST /workouts/:id/clone', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * PUT /workouts/:id
 * -> mettre à jour une séance perso (nom + liste d’exos)
 * Body :
 * {
 *   name?: string;
 *   description?: string | null;
 *   type?: "SIMPLE" | "CIRCUIT";
 *   exercises?: {
 *     exerciseId: number;
 *     order: number;
 *     sets?: number | null;
 *     reps?: number | null;
 *     durationSec?: number | null;
 *     restSec?: number | null;
 *     notes?: string | null;
 *     circuitIndex?: number | null;
 *     circuitOrder?: number | null;
 *   }[];
 * }
 */
workoutsRouter.put(
  '/:id',
  authRequired,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

      const existing = await prisma.workout.findUnique({
        where: { id },
        include: { exercises: true },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Séance introuvable' });
      }

      if (existing.ownerId !== userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const {
        name,
        description,
        type,
        exercises,
      }: {
        name?: string;
        description?: string | null;
        type?: WorkoutType;
        exercises?: {
          exerciseId: number;
          order: number;
          sets?: number | null;
          reps?: number | null;
          durationSec?: number | null;
          restSec?: number | null;
          notes?: string | null;
          circuitIndex?: number | null;
          circuitOrder?: number | null;
        }[];
      } = req.body || {};

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (type !== undefined) updateData.type = type;

      const result = await prisma.$transaction(async (tx) => {
        if (exercises) {
          // On supprime tous les exos liés et on recrée depuis la liste envoyée
          await tx.workoutExercise.deleteMany({
            where: { workoutId: id },
          });

          await tx.workoutExercise.createMany({
            data: exercises.map((e) => ({
              workoutId: id,
              exerciseId: e.exerciseId,
              order: e.order,
              sets: e.sets ?? null,
              reps: e.reps ?? null,
              durationSec: e.durationSec ?? null,
              restSec: e.restSec ?? null,
              notes: e.notes ?? null,
              circuitIndex: e.circuitIndex ?? null,
              circuitOrder: e.circuitOrder ?? null,
            })),
          });
        }

        const updated = await tx.workout.findUnique({
          where: { id },
          include: {
            exercises: {
              orderBy: { order: 'asc' },
              include: {
                exercise: true,
              },
            },
          },
        });

        if (!updated) throw new Error('Workout disparu pendant la transaction');
        return updated;
      });

      return res.json(result);
    } catch (err) {
      console.error('Error PUT /workouts/:id', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

/**
 * POST /workouts
 * -> créer une nouvelle séance personnalisée pour l'utilisateur connecté
 */
workoutsRouter.post('/', authRequired, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      name,
      description,
      type,
      exercises,
    }: {
      name: string;
      description?: string | null;
      type?: WorkoutType;
      exercises?: {
        exerciseId: number;
        order: number;
        sets?: number | null;
        reps?: number | null;
        durationSec?: number | null;
        restSec?: number | null;
        notes?: string | null;
        circuitIndex?: number | null;
        circuitOrder?: number | null;
      }[];
    } = req.body || {};

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Nom de séance requis' });
    }

    const created = await prisma.workout.create({
      data: {
        name,
        description: description ?? null,
        type: type ?? 'SIMPLE',
        isPublic: false,
        ownerId: userId,
        exercises: exercises
          ? { create: exercises.map((e) => ({
              exerciseId: e.exerciseId,
              order: e.order,
              sets: e.sets ?? null,
              reps: e.reps ?? null,
              durationSec: e.durationSec ?? null,
              restSec: e.restSec ?? null,
              notes: e.notes ?? null,
              circuitIndex: e.circuitIndex ?? null,
              circuitOrder: e.circuitOrder ?? null,
            })) }
          : undefined,
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: { exercise: true },
        },
      },
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error POST /workouts', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /workouts/:id
 * -> supprimer une séance perso de l'utilisateur
 */
workoutsRouter.delete('/:id', authRequired, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

    const existing = await prisma.workout.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Séance introuvable' });
    if (existing.ownerId !== userId) return res.status(403).json({ error: 'Accès refusé' });

    await prisma.$transaction(async (tx) => {
      await tx.workoutExercise.deleteMany({ where: { workoutId: id } });
      await tx.workout.delete({ where: { id } });
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error DELETE /workouts/:id', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export { workoutsRouter };
