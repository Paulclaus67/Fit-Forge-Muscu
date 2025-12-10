// backend/src/routes/weeklyPlan.ts
import { Router, Response } from 'express';
import { prisma } from '../prismaClient';
import { authRequired, AuthRequest } from '../middleware/auth';
import { DayOfWeek } from '@prisma/client';

const weeklyPlanRouter = Router();

/**
 * GET /weekly-plan
 * Récupère le planning hebdo actif de l'utilisateur connecté
 */
weeklyPlanRouter.get('/', authRequired, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const plan = await prisma.weeklyPlan.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        items: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { order: 'asc' },
          ],
          include: {
            workout: true,
          },
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Aucun planning actif trouvé' });
    }

    return res.json(plan);
  } catch (err) {
    console.error('Error GET /weekly-plan', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /weekly-plan/setup-default
 * Crée un planning par défaut basé sur ton programme, pour l'utilisateur connecté
 */
weeklyPlanRouter.post(
  '/setup-default',
  authRequired,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      // On va chercher les séances globales par leur nom
      const workouts = await prisma.workout.findMany({
        where: {
          ownerId: null,
          name: {
            in: [
              'Séance Dos',
              'Séance Jambes',
              'Circuit Biceps',
              'Routine pompes maison',
              'Circuit pec + triceps',
            ],
          },
        },
      });

      const getWorkoutId = (name: string) =>
        workouts.find((w) => w.name === name)?.id ?? null;

      const seanceDosId = getWorkoutId('Séance Dos');
      const seanceJambesId = getWorkoutId('Séance Jambes');
      const circuitBicepsId = getWorkoutId('Circuit Biceps');
      const routinePompesId = getWorkoutId('Routine pompes maison');
      const circuitPecTricepsId = getWorkoutId('Circuit pec + triceps');

      // On désactive les plannings actifs existants (si tu re-setup)
      await prisma.weeklyPlan.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });

      const plan = await prisma.weeklyPlan.create({
        data: {
          userId,
          name: 'Programme hebdo par défaut',
          isActive: true,
          items: {
            create: [
              // LUNDI : 10 min d’étirements / posture + Séance Dos
              {
                dayOfWeek: DayOfWeek.MONDAY,
                order: 1,
                label: '10 min d’étirements / travail de posture',
                isOptional: false,
              },
              {
                dayOfWeek: DayOfWeek.MONDAY,
                order: 2,
                label: 'Séance Dos',
                isOptional: false,
                workoutId: seanceDosId ?? undefined,
              },

              // MARDI : 10 min de poirier (facultatif) + Circuit pec + triceps
              {
                dayOfWeek: DayOfWeek.TUESDAY,
                order: 1,
                label: '10 min de poirier',
                isOptional: true,
              },
              {
                dayOfWeek: DayOfWeek.TUESDAY,
                order: 2,
                label: 'Circuit pec + triceps',
                isOptional: false,
                workoutId: circuitPecTricepsId ?? undefined,
              },

              // MERCREDI : 20–30 min de poirier + Séance Jambes
              {
                dayOfWeek: DayOfWeek.WEDNESDAY,
                order: 1,
                label: '20–30 min de poirier (ex : 10–15 min avant + 10–15 min après)',
                isOptional: false,
              },
              {
                dayOfWeek: DayOfWeek.WEDNESDAY,
                order: 2,
                label: 'Séance Jambes',
                isOptional: false,
                workoutId: seanceJambesId ?? undefined,
              },

              // JEUDI : 10 min de poirier + Circuit Biceps
              {
                dayOfWeek: DayOfWeek.THURSDAY,
                order: 1,
                label: '10 min de poirier',
                isOptional: false,
              },
              {
                dayOfWeek: DayOfWeek.THURSDAY,
                order: 2,
                label: 'Circuit Biceps',
                isOptional: false,
                workoutId: circuitBicepsId ?? undefined,
              },

              // VENDREDI : 10 min de poirier (facultatif) + Routine pompes maison
              {
                dayOfWeek: DayOfWeek.FRIDAY,
                order: 1,
                label: '10 min de poirier',
                isOptional: true,
              },
              {
                dayOfWeek: DayOfWeek.FRIDAY,
                order: 2,
                label: 'Routine pompes maison',
                isOptional: false,
                workoutId: routinePompesId ?? undefined,
              },

              // SAMEDI : Repos
              {
                dayOfWeek: DayOfWeek.SATURDAY,
                order: 1,
                label: 'Repos',
                isOptional: false,
              },

              // DIMANCHE : Repos
              {
                dayOfWeek: DayOfWeek.SUNDAY,
                order: 1,
                label: 'Repos',
                isOptional: false,
              },
            ],
          },
        },
        include: {
          items: {
            orderBy: [
              { dayOfWeek: 'asc' },
              { order: 'asc' },
            ],
            include: {
              workout: true,
            },
          },
        },
      });

      return res.status(201).json(plan);
    } catch (err) {
      console.error('Error POST /weekly-plan/setup-default', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

export { weeklyPlanRouter };

weeklyPlanRouter.put(
  '/items/:id',
  authRequired,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const itemId = Number(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: 'id invalide' });
      }

      const { workoutId, label, isOptional } = req.body as {
        workoutId?: number | null;
        label?: string;
        isOptional?: boolean;
      };

      // Vérifier que l'item appartient bien à un planning de cet utilisateur
      const plan = await prisma.weeklyPlan.findFirst({
        where: {
          userId,
          items: {
            some: { id: itemId },
          },
        },
      });

      if (!plan) {
        return res
          .status(404)
          .json({ error: "Cet item n'appartient à aucun planning de cet utilisateur" });
      }

      // Si on change de séance, vérifier que cette séance est accessible à l'user
      let checkedWorkoutId: number | null | undefined = workoutId;
      if (workoutId !== undefined && workoutId !== null) {
        const workout = await prisma.workout.findUnique({
          where: { id: workoutId },
        });

        if (
          !workout ||
          (workout.ownerId !== null && workout.ownerId !== userId)
        ) {
          return res
            .status(400)
            .json({ error: 'Séance non trouvée ou non accessible' });
        }

        checkedWorkoutId = workout.id;
      }

      const updateData: any = {};
      if (checkedWorkoutId !== undefined) updateData.workoutId = checkedWorkoutId;
      if (label !== undefined) updateData.label = label;
      if (isOptional !== undefined) updateData.isOptional = isOptional;

      const updatedItem = await prisma.weeklyPlanItem.update({
        where: { id: itemId },
        data: updateData,
        include: {
          workout: true,
        },
      });

      return res.json(updatedItem);
    } catch (err) {
      console.error('Error PUT /weekly-plan/items/:id', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);