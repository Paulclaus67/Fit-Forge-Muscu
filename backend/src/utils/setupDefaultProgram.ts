// backend/src/utils/setupDefaultProgram.ts
import { prisma } from '../prismaClient';
import { DayOfWeek, WorkoutType, Difficulty, MuscleGroup } from '@prisma/client';

/**
 * Crée le programme par défaut pour un nouvel utilisateur
 */
export async function setupDefaultProgram(userId: number) {
  try {
    // Créer les exercices globaux s'ils n'existent pas déjà
    await createGlobalExercisesIfNeeded();
    
    // Créer les séances globales si elles n'existent pas
    await createGlobalWorkoutsIfNeeded();
    
    // Créer le planning hebdomadaire pour l'utilisateur
    await createWeeklyPlanForUser(userId);
    
    console.log(`✅ Programme par défaut créé pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de la création du programme par défaut:', error);
    throw error;
  }
}

async function createGlobalExercisesIfNeeded() {
  const existingCount = await prisma.exercise.count({ where: { ownerId: null } });
  if (existingCount > 0) {
    return; // Les exercices globaux existent déjà
  }

  // Exercices pour Séance Jambes
  await prisma.exercise.create({
    data: {
      name: 'Pistol Squat',
      description: 'Squat sur une jambe',
      instructions: '10 répétitions par jambe, 4 séries, 45 secondes de repos',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.LEGS, isPrimary: true },
          { group: MuscleGroup.GLUTES, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Chaise + Squats sautés',
      description: 'Enchaînement chaise (40s) puis squats sautés (15-20 reps)',
      instructions: '4 séries, 1 minute de repos entre séries',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Mur + Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.LEGS, isPrimary: true },
          { group: MuscleGroup.GLUTES, isPrimary: true },
        ],
      },
    },
  });

  // Exercices pour Séance Dos
  await prisma.exercise.create({
    data: {
      name: 'Tractions pronation',
      description: 'Tractions prise classique (pronation)',
      instructions: 'Maximum de reps (objectif: au moins 10), 4 séries, 1m45 de repos. Finir en négatif si besoin.',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.BACK, isPrimary: true },
          { group: MuscleGroup.BICEPS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Tractions australiennes prise large',
      description: 'Body row sous une barre, prise pronation large',
      instructions: 'Maximum de reps, 4 séries, 1m45 de repos',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barre basse',
      muscles: {
        create: [
          { group: MuscleGroup.BACK, isPrimary: true },
          { group: MuscleGroup.BICEPS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Relevés de genoux à la barre',
      description: 'Suspension à la barre, monter les genoux vers la poitrine',
      instructions: '10-15 reps, 3 séries, 1m45 de repos',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.CORE, isPrimary: true },
        ],
      },
    },
  });

  // Exercices pour Circuit Biceps
  await prisma.exercise.create({
    data: {
      name: 'Tentatives de front lever',
      description: 'Tirer le corps en position front lever',
      instructions: '7 tentatives/maintiens',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.CORE, isPrimary: true },
          { group: MuscleGroup.BACK, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Muscle up négatif',
      description: 'Partir en haut du muscle up et descendre très contrôlé',
      instructions: '4 reps',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.BACK, isPrimary: true },
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.TRICEPS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Tractions australiennes inversées',
      description: 'Rowing inversé avec accent sur les biceps',
      instructions: '7 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barre basse',
      muscles: {
        create: [
          { group: MuscleGroup.BICEPS, isPrimary: true },
          { group: MuscleGroup.BACK, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Tractions 5-5-5',
      description: '5 tractions large + 5 moyenne + 5 serrée',
      instructions: '15 reps au total (5+5+5)',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.BACK, isPrimary: true },
          { group: MuscleGroup.BICEPS, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Curl à la barre australienne supination',
      description: 'Sous la barre, corps incliné, prise supination',
      instructions: '7 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barre basse',
      muscles: {
        create: [
          { group: MuscleGroup.BICEPS, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Curl à la barre archer',
      description: 'Une main travaille plus que l\'autre, style archer',
      instructions: '4 reps de chaque côté (facultatif)',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre basse',
      muscles: {
        create: [
          { group: MuscleGroup.BICEPS, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Tractions commando',
      description: 'Mains proches, tête qui alterne de chaque côté',
      instructions: '5 reps par côté',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Barre de traction',
      muscles: {
        create: [
          { group: MuscleGroup.BACK, isPrimary: true },
          { group: MuscleGroup.BICEPS, isPrimary: true },
        ],
      },
    },
  });

  // Exercices pour Routine Pompes Maison
  await prisma.exercise.create({
    data: {
      name: 'Pompes explosives négatives',
      description: 'Descente lente, remontée explosive',
      instructions: '10-20 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.TRICEPS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes diamant',
      description: 'Mains rapprochées sous la poitrine',
      instructions: '10-20 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.TRICEPS, isPrimary: true },
          { group: MuscleGroup.CHEST, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes archer alternées',
      description: 'Une main plus avancée, alternance droite/gauche',
      instructions: '10-20 reps',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes touche d\'épaule alternée',
      description: 'En haut, toucher une épaule avec la main opposée',
      instructions: '10-20 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.CORE, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes volantes',
      description: 'Pompes pliométriques avec décollage des mains',
      instructions: '10-20 reps. Mains à largeur d\'épaules, descente contrôlée, remontée explosive pour décoller les mains.',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.TRICEPS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes classiques',
      description: 'Pompes standard',
      instructions: '10-20 reps',
      difficulty: Difficulty.BEGINNER,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.TRICEPS, isPrimary: false },
        ],
      },
    },
  });

  // Exercices pour Circuit Pec + Triceps
  await prisma.exercise.create({
    data: {
      name: 'Dips droits',
      description: 'Dips parallèles',
      instructions: '10-20 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barres parallèles',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.TRICEPS, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes 90° + pompes',
      description: 'Buste projeté en avant, focus épaules/pecs',
      instructions: '5-10 reps. Épaules au-dessus ou légèrement en avant des mains.',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.SHOULDERS, isPrimary: true },
          { group: MuscleGroup.CHEST, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Extension de triceps',
      description: 'Extension triceps au sol (type sphinx)',
      instructions: '8-10 reps. Position de planche, descendre sur les avant-bras, remonter.',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.TRICEPS, isPrimary: true },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Pompes explosives négatives pieds surélevés',
      description: 'Pieds en hauteur, descente contrôlée, remontée explosive',
      instructions: '10-20 reps',
      difficulty: Difficulty.ADVANCED,
      equipment: 'Banc/support + Poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.CHEST, isPrimary: true },
          { group: MuscleGroup.SHOULDERS, isPrimary: false },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      name: 'Skull-crusher',
      description: 'Extension de triceps où les mains viennent vers le front',
      instructions: '8-10 reps',
      difficulty: Difficulty.INTERMEDIATE,
      equipment: 'Barre ou poids du corps',
      muscles: {
        create: [
          { group: MuscleGroup.TRICEPS, isPrimary: true },
        ],
      },
    },
  });

  console.log('✅ Exercices globaux créés');
}

async function createGlobalWorkoutsIfNeeded() {
  const existingCount = await prisma.workout.count({ where: { ownerId: null } });
  if (existingCount > 0) {
    return; // Les séances globales existent déjà
  }

  // Récupérer tous les exercices créés
  const exercises = await prisma.exercise.findMany({ where: { ownerId: null } });
  
  const getExerciseId = (name: string) => exercises.find(e => e.name === name)?.id;

  // Séance Jambes
  await prisma.workout.create({
    data: {
      name: 'Séance Jambes',
      description: 'Séance complète pour les jambes',
      type: WorkoutType.SIMPLE,
      exercises: {
        create: [
          {
            exerciseId: getExerciseId('Pistol Squat')!,
            order: 1,
            sets: 4,
            reps: 10,
            restSec: 45,
            notes: '10 répétitions par jambe',
          },
          {
            exerciseId: getExerciseId('Chaise + Squats sautés')!,
            order: 2,
            sets: 4,
            reps: null,
            restSec: 60,
            notes: 'Chaise 40s + 15-20 squats sautés = 1 série',
          },
        ],
      },
    },
  });

  // Séance Dos
  await prisma.workout.create({
    data: {
      name: 'Séance Dos',
      description: 'Séance complète pour le dos',
      type: WorkoutType.SIMPLE,
      exercises: {
        create: [
          {
            exerciseId: getExerciseId('Tractions pronation')!,
            order: 1,
            sets: 4,
            reps: null,
            restSec: 105,
            notes: 'Maximum (objectif: au moins 10). Finir en négatif si besoin.',
          },
          {
            exerciseId: getExerciseId('Tractions australiennes prise large')!,
            order: 2,
            sets: 4,
            reps: null,
            restSec: 105,
            notes: 'Maximum de répétitions',
          },
          {
            exerciseId: getExerciseId('Relevés de genoux à la barre')!,
            order: 3,
            sets: 3,
            reps: 12,
            restSec: 105,
            notes: '10-15 répétitions',
          },
        ],
      },
    },
  });

  // Circuit Biceps
  await prisma.workout.create({
    data: {
      name: 'Circuit Biceps',
      description: 'Circuit intensif pour les biceps - 3 à 4 tours, 2min de repos entre tours',
      type: WorkoutType.CIRCUIT,
      exercises: {
        create: [
          {
            exerciseId: getExerciseId('Tentatives de front lever')!,
            order: 1,
            circuitIndex: 1,
            circuitOrder: 1,
            sets: 1,
            reps: 7,
            restSec: 0,
          },
          {
            exerciseId: getExerciseId('Muscle up négatif')!,
            order: 2,
            circuitIndex: 1,
            circuitOrder: 2,
            sets: 1,
            reps: 4,
            restSec: 45,
            notes: 'Repos 45s après ce bloc',
          },
          {
            exerciseId: getExerciseId('Tractions australiennes inversées')!,
            order: 3,
            circuitIndex: 1,
            circuitOrder: 3,
            sets: 1,
            reps: 7,
            restSec: 0,
          },
          {
            exerciseId: getExerciseId('Tractions 5-5-5')!,
            order: 4,
            circuitIndex: 1,
            circuitOrder: 4,
            sets: 1,
            reps: 15,
            restSec: 0,
            notes: '5 large + 5 moyenne + 5 serrée',
          },
          {
            exerciseId: getExerciseId('Curl à la barre australienne supination')!,
            order: 5,
            circuitIndex: 1,
            circuitOrder: 5,
            sets: 1,
            reps: 7,
            restSec: 0,
          },
          {
            exerciseId: getExerciseId('Curl à la barre archer')!,
            order: 6,
            circuitIndex: 1,
            circuitOrder: 6,
            sets: 1,
            reps: 8,
            restSec: 0,
            notes: '4 de chaque côté (facultatif)',
          },
          {
            exerciseId: getExerciseId('Tractions commando')!,
            order: 7,
            circuitIndex: 1,
            circuitOrder: 7,
            sets: 1,
            reps: 10,
            restSec: 120,
            notes: '5 par côté. Fin du tour: 2min de repos',
          },
        ],
      },
    },
  });

  // Routine Pompes Maison
  await prisma.workout.create({
    data: {
      name: 'Routine Pompes Maison',
      description: 'Circuit de 6 variantes de pompes - 3 à 4 tours, 30s repos entre exos, 2min entre tours',
      type: WorkoutType.CIRCUIT,
      exercises: {
        create: [
          {
            exerciseId: getExerciseId('Pompes explosives négatives')!,
            order: 1,
            circuitIndex: 1,
            circuitOrder: 1,
            sets: 1,
            reps: 15,
            restSec: 30,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes diamant')!,
            order: 2,
            circuitIndex: 1,
            circuitOrder: 2,
            sets: 1,
            reps: 15,
            restSec: 30,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes archer alternées')!,
            order: 3,
            circuitIndex: 1,
            circuitOrder: 3,
            sets: 1,
            reps: 15,
            restSec: 30,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes touche d\'épaule alternée')!,
            order: 4,
            circuitIndex: 1,
            circuitOrder: 4,
            sets: 1,
            reps: 15,
            restSec: 30,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes volantes')!,
            order: 5,
            circuitIndex: 1,
            circuitOrder: 5,
            sets: 1,
            reps: 15,
            restSec: 30,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes classiques')!,
            order: 6,
            circuitIndex: 1,
            circuitOrder: 6,
            sets: 1,
            reps: 15,
            restSec: 120,
            notes: '10-20 reps. Fin du tour: 2min de repos',
          },
        ],
      },
    },
  });

  // Circuit Pec + Triceps
  await prisma.workout.create({
    data: {
      name: 'Circuit Pec + Triceps',
      description: 'Circuit intensif pecs et triceps - 3 à 4 tours, 2min de repos entre tours',
      type: WorkoutType.CIRCUIT,
      exercises: {
        create: [
          {
            exerciseId: getExerciseId('Pompes explosives négatives')!,
            order: 1,
            circuitIndex: 1,
            circuitOrder: 1,
            sets: 1,
            reps: 15,
            restSec: 20,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Dips droits')!,
            order: 2,
            circuitIndex: 1,
            circuitOrder: 2,
            sets: 1,
            reps: 15,
            restSec: 20,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes diamant')!,
            order: 3,
            circuitIndex: 1,
            circuitOrder: 3,
            sets: 1,
            reps: 15,
            restSec: 20,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Pompes 90° + pompes')!,
            order: 4,
            circuitIndex: 1,
            circuitOrder: 4,
            sets: 1,
            reps: 7,
            restSec: 20,
            notes: '5-10 reps',
          },
          {
            exerciseId: getExerciseId('Extension de triceps')!,
            order: 5,
            circuitIndex: 1,
            circuitOrder: 5,
            sets: 1,
            reps: 9,
            restSec: 20,
            notes: '8-10 reps',
          },
          {
            exerciseId: getExerciseId('Pompes explosives négatives pieds surélevés')!,
            order: 6,
            circuitIndex: 1,
            circuitOrder: 6,
            sets: 1,
            reps: 15,
            restSec: 20,
            notes: '10-20 reps',
          },
          {
            exerciseId: getExerciseId('Skull-crusher')!,
            order: 7,
            circuitIndex: 1,
            circuitOrder: 7,
            sets: 1,
            reps: 9,
            restSec: 120,
            notes: '8-10 reps. Fin du tour: 2min de repos',
          },
        ],
      },
    },
  });

  console.log('✅ Séances globales créées');
}

async function createWeeklyPlanForUser(userId: number) {
  // Vérifier si l'utilisateur a déjà un planning
  const existingPlan = await prisma.weeklyPlan.findFirst({
    where: { userId },
  });

  if (existingPlan) {
    return; // L'utilisateur a déjà un planning
  }

  // Récupérer les séances
  const workouts = await prisma.workout.findMany({
    where: {
      ownerId: null,
      name: {
        in: [
          'Séance Dos',
          'Séance Jambes',
          'Circuit Biceps',
          'Routine Pompes Maison',
          'Circuit Pec + Triceps',
        ],
      },
    },
  });

  const getWorkoutId = (name: string) => workouts.find(w => w.name === name)?.id;

  await prisma.weeklyPlan.create({
    data: {
      userId,
      name: 'Programme hebdo par défaut',
      isActive: true,
      items: {
        create: [
          // LUNDI
          {
            dayOfWeek: DayOfWeek.MONDAY,
            order: 1,
            label: '10 min d\'étirements / travail de posture',
            isOptional: false,
          },
          {
            dayOfWeek: DayOfWeek.MONDAY,
            order: 2,
            workoutId: getWorkoutId('Séance Dos'),
            label: '',
            isOptional: false,
          },
          // MARDI
          {
            dayOfWeek: DayOfWeek.TUESDAY,
            order: 1,
            label: '10 min de poirier',
            isOptional: true,
          },
          {
            dayOfWeek: DayOfWeek.TUESDAY,
            order: 2,
            workoutId: getWorkoutId('Circuit Pec + Triceps'),
            label: '',
            isOptional: false,
          },
          // MERCREDI
          {
            dayOfWeek: DayOfWeek.WEDNESDAY,
            order: 1,
            label: '20 à 30 min de poirier (ex: 10-15 min avant + 10-15 min après)',
            isOptional: false,
          },
          {
            dayOfWeek: DayOfWeek.WEDNESDAY,
            order: 2,
            workoutId: getWorkoutId('Séance Jambes'),
            label: '',
            isOptional: false,
          },
          // JEUDI
          {
            dayOfWeek: DayOfWeek.THURSDAY,
            order: 1,
            label: '10 min de poirier',
            isOptional: false,
          },
          {
            dayOfWeek: DayOfWeek.THURSDAY,
            order: 2,
            workoutId: getWorkoutId('Circuit Biceps'),
            label: '',
            isOptional: false,
          },
          // VENDREDI
          {
            dayOfWeek: DayOfWeek.FRIDAY,
            order: 1,
            label: '10 min de poirier',
            isOptional: true,
          },
          {
            dayOfWeek: DayOfWeek.FRIDAY,
            order: 2,
            workoutId: getWorkoutId('Routine Pompes Maison'),
            label: '',
            isOptional: false,
          },
          // SAMEDI - Repos
          {
            dayOfWeek: DayOfWeek.SATURDAY,
            order: 1,
            label: 'Repos',
            isOptional: false,
          },
          // DIMANCHE - Repos
          {
            dayOfWeek: DayOfWeek.SUNDAY,
            order: 1,
            label: 'Repos',
            isOptional: false,
          },
        ],
      },
    },
  });

  console.log('✅ Planning hebdomadaire créé pour l\'utilisateur');
}

