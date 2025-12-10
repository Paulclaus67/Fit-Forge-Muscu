import {
  PrismaClient,
  Difficulty,
  MuscleGroup,
  WorkoutType,
} from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: './prisma/dev.db' });
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });


async function main() {
  console.log('🧹 Cleaning existing data (dev only)...');

  // On ne touche qu'aux tables nécessaires pour l’instant
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exerciseTargetMuscle.deleteMany();
  await prisma.exercise.deleteMany();

  console.log('✅ Clean done, seeding templates...');

  // Helper pour créer un exercice avec muscles
  async function createExercise(params: {
    name: string;
    description?: string;
    instructions?: string;
    difficulty?: Difficulty;
    equipment?: string;
    muscles?: { group: MuscleGroup; isPrimary?: boolean }[];
  }) {
    const { muscles = [], ...rest } = params;

    return prisma.exercise.create({
      data: {
        ...rest,
        muscles: {
          create: muscles.map((m) => ({
            group: m.group,
            isPrimary: m.isPrimary ?? false,
          })),
        },
      },
    });
  }

  // ---------------------------
  //   EXERCICES TEMPLATES
  // ---------------------------

  // JAMBES
  const pistolSquat = await createExercise({
    name: 'Pistol squat',
    description: 'Squat sur une jambe.',
    instructions:
      'Debout sur une jambe, descends en contrôlant, remonte en poussant dans le talon.',
    difficulty: Difficulty.ADVANCED,
    muscles: [
      { group: MuscleGroup.LEGS, isPrimary: true },
      { group: MuscleGroup.GLUTES },
      { group: MuscleGroup.CORE },
    ],
  });

  const wallSit = await createExercise({
    name: 'Chaise (wall sit)',
    description: 'Isométrique dos au mur, cuisses parallèles au sol.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [{ group: MuscleGroup.LEGS, isPrimary: true }],
  });

  const jumpSquats = await createExercise({
    name: 'Squats sautés',
    description: 'Squats pliométriques.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [
      { group: MuscleGroup.LEGS, isPrimary: true },
      { group: MuscleGroup.GLUTES },
    ],
  });

  // DOS
  const pullUps = await createExercise({
    name: 'Tractions pronation classiques',
    description: 'Prise pronation, un peu plus large que les épaules.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.BICEPS },
      { group: MuscleGroup.CORE },
    ],
  });

  const aussiePullUpsWide = await createExercise({
    name: 'Tractions australiennes (prise large)',
    description: 'Body row sous une barre avec prise large.',
    difficulty: Difficulty.BEGINNER,
    equipment: 'Barre à hauteur de hanches',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.BICEPS },
    ],
  });

  const hangingKneeRaises = await createExercise({
    name: 'Relevés de genoux à la barre',
    description: 'Monter les genoux vers la poitrine en suspension.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.CORE, isPrimary: true },
      { group: MuscleGroup.BACK },
    ],
  });

  // BICEPS / TIRAGE
  const frontLeverAttempts = await createExercise({
    name: 'Tentatives de front lever',
    description: 'Tentatives ou maintiens de front lever.',
    difficulty: Difficulty.ADVANCED,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.CORE },
      { group: MuscleGroup.BICEPS },
    ],
  });

  const muscleUpNegative = await createExercise({
    name: 'Muscle up négatif',
    description: 'Phase descendante contrôlée du muscle up.',
    difficulty: Difficulty.ADVANCED,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.CHEST },
      { group: MuscleGroup.TRICEPS },
      { group: MuscleGroup.BICEPS },
    ],
  });

  const aussieRowBiceps = await createExercise({
    name: 'Tractions australiennes inversées (biceps)',
    description: 'Rowing inversé avec focus sur les biceps.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barre à hauteur de hanches',
    muscles: [
      { group: MuscleGroup.BICEPS, isPrimary: true },
      { group: MuscleGroup.BACK },
    ],
  });

  const pullUps555 = await createExercise({
    name: 'Tractions 5–5–5',
    description: '5 larges, 5 moyennes, 5 serrées.',
    difficulty: Difficulty.ADVANCED,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.BICEPS },
      { group: MuscleGroup.CORE },
    ],
  });

  const curlAussieSupination = await createExercise({
    name: 'Curl à la barre (australienne supination)',
    description: 'Rowing inversé en supination pour les biceps.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barre à hauteur de hanches',
    muscles: [{ group: MuscleGroup.BICEPS, isPrimary: true }],
  });

  const curlArcher = await createExercise({
    name: 'Curl à la barre archer',
    description: 'Curl asymétrique type archer.',
    difficulty: Difficulty.ADVANCED,
    equipment: 'Barre à hauteur de hanches',
    muscles: [{ group: MuscleGroup.BICEPS, isPrimary: true }],
  });

  const commandoPullUps = await createExercise({
    name: 'Tractions commando',
    description: 'Mains proches, tête alternée à gauche/droite.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barre de traction',
    muscles: [
      { group: MuscleGroup.BACK, isPrimary: true },
      { group: MuscleGroup.BICEPS },
      { group: MuscleGroup.CORE },
    ],
  });

  // POMPES / PECS / TRICEPS
  const pushUpsExplosiveNegative = await createExercise({
    name: 'Pompes explosives négatives',
    description: 'Descente lente, remontée explosive.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.TRICEPS },
      { group: MuscleGroup.SHOULDERS },
      { group: MuscleGroup.CORE },
    ],
  });

  const pushUpsDiamond = await createExercise({
    name: 'Pompes diamant',
    description: 'Mains rapprochées sous la poitrine.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [
      { group: MuscleGroup.TRICEPS, isPrimary: true },
      { group: MuscleGroup.CHEST },
    ],
  });

  const pushUpsArcherAlternating = await createExercise({
    name: 'Pompes archer alternées',
    description: 'Pompes asymétriques, une main plus chargée.',
    difficulty: Difficulty.ADVANCED,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.TRICEPS },
      { group: MuscleGroup.SHOULDERS },
    ],
  });

  const pushUpsShoulderTap = await createExercise({
    name: "Pompes touche d'épaule alternée",
    description: 'Pompes avec touche d’épaule en haut du mouvement.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.CORE },
    ],
  });

  const pushUpsFlying = await createExercise({
    name: 'Pompes volantes',
    description: 'Pompes pliométriques avec décollage des mains.',
    difficulty: Difficulty.ADVANCED,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.TRICEPS },
      { group: MuscleGroup.SHOULDERS },
    ],
  });

  const pushUpsClassic = await createExercise({
    name: 'Pompes classiques',
    description: 'Pompes standard.',
    difficulty: Difficulty.BEGINNER,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.TRICEPS },
    ],
  });

  const dips = await createExercise({
    name: 'Dips droits / parallèles',
    description: 'Dips aux barres parallèles.',
    difficulty: Difficulty.INTERMEDIATE,
    equipment: 'Barres parallèles',
    muscles: [
      { group: MuscleGroup.TRICEPS, isPrimary: true },
      { group: MuscleGroup.CHEST },
      { group: MuscleGroup.SHOULDERS },
    ],
  });

  const pushUps90 = await createExercise({
    name: 'Pompes 90°',
    description: 'Buste projeté vers l’avant, gros focus épaules/pecs.',
    difficulty: Difficulty.ADVANCED,
    muscles: [
      { group: MuscleGroup.SHOULDERS, isPrimary: true },
      { group: MuscleGroup.CHEST },
    ],
  });

  const tricepsExtensionFloor = await createExercise({
    name: 'Extension de triceps au sol (sphinx)',
    description: 'Extension de triceps en partant sur les avant-bras.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [{ group: MuscleGroup.TRICEPS, isPrimary: true }],
  });

  const pushUpsExplosiveFeetElevated = await createExercise({
    name: 'Pompes explosives négatives pieds surélevés',
    description: 'Comme les explosives négatives mais pieds en hauteur.',
    difficulty: Difficulty.ADVANCED,
    muscles: [
      { group: MuscleGroup.CHEST, isPrimary: true },
      { group: MuscleGroup.SHOULDERS },
      { group: MuscleGroup.TRICEPS },
    ],
  });

  const skullCrusher = await createExercise({
    name: 'Skull-crusher au poids du corps',
    description: 'Extension de triceps où la tête se rapproche des mains.',
    difficulty: Difficulty.INTERMEDIATE,
    muscles: [{ group: MuscleGroup.TRICEPS, isPrimary: true }],
  });

  // ---------------------------
  //   SÉANCES (WORKOUTS)
  // ---------------------------

  // Séance JAMBES
  const jambes = await prisma.workout.create({
    data: {
      name: 'Séance Jambes',
      type: WorkoutType.SIMPLE,
      isPublic: true,
      description:
        'Pistol squats + combo chaise + squats sautés.',
      exercises: {
        create: [
          {
            exerciseId: pistolSquat.id,
            order: 1,
            sets: 4,
            reps: 10,
            restSec: 45,
            notes: '10 répétitions par jambe.',
          },
          {
            exerciseId: wallSit.id,
            order: 2,
            sets: 4,
            durationSec: 40,
            restSec: 0,
            notes: 'Tenir ~40 secondes.',
          },
          {
            exerciseId: jumpSquats.id,
            order: 3,
            sets: 4,
            reps: 15,
            restSec: 60,
            notes: '15–20 répétitions, enchaînées après la chaise.',
          },
        ],
      },
    },
  });

  // Séance DOS
  const dos = await prisma.workout.create({
    data: {
      name: 'Séance Dos',
      type: WorkoutType.SIMPLE,
      isPublic: true,
      description: 'Tractions, tractions australiennes, relevés de genoux.',
      exercises: {
        create: [
          {
            exerciseId: pullUps.id,
            order: 1,
            sets: 4,
            reps: 10,
            restSec: 105, // 1min45
            notes:
              'Rép max, objectif ≥ 10. Finir en négatif si besoin.',
          },
          {
            exerciseId: aussiePullUpsWide.id,
            order: 2,
            sets: 4,
            reps: 0, // max reps
            restSec: 105,
            notes: 'Répétitions maximum.',
          },
          {
            exerciseId: hangingKneeRaises.id,
            order: 3,
            sets: 3,
            reps: 12,
            restSec: 105,
            notes: '10–15 répétitions.',
          },
        ],
      },
    },
  });

  // Circuit BICEPS
  const biceps = await prisma.workout.create({
    data: {
      name: 'Circuit Biceps',
      type: WorkoutType.CIRCUIT,
      isPublic: true,
      description:
        '7 exercices enchaînés, 3–4 tours, repos 2 minutes entre tours.',
      exercises: {
        create: [
          {
            exerciseId: frontLeverAttempts.id,
            order: 1,
            sets: 3,
            reps: 7,
            circuitIndex: 1,
            circuitOrder: 1,
          },
          {
            exerciseId: muscleUpNegative.id,
            order: 2,
            sets: 3,
            reps: 4,
            restSec: 45,
            circuitIndex: 1,
            circuitOrder: 2,
          },
          {
            exerciseId: aussieRowBiceps.id,
            order: 3,
            sets: 3,
            reps: 7,
            circuitIndex: 1,
            circuitOrder: 3,
          },
          {
            exerciseId: pullUps555.id,
            order: 4,
            sets: 3,
            reps: 15,
            circuitIndex: 1,
            circuitOrder: 4,
          },
          {
            exerciseId: curlAussieSupination.id,
            order: 5,
            sets: 3,
            reps: 7,
            circuitIndex: 1,
            circuitOrder: 5,
          },
          {
            exerciseId: curlArcher.id,
            order: 6,
            sets: 3,
            reps: 4,
            circuitIndex: 1,
            circuitOrder: 6,
          },
          {
            exerciseId: commandoPullUps.id,
            order: 7,
            sets: 3,
            reps: 10,
            restSec: 120,
            circuitIndex: 1,
            circuitOrder: 7,
          },
        ],
      },
    },
  });

  // Routine POMPES MAISON
  const routinePompes = await prisma.workout.create({
    data: {
      name: 'Routine pompes maison',
      type: WorkoutType.CIRCUIT,
      isPublic: true,
      description:
        '6 variantes de pompes, 3–4 tours, 30s entre exos, 2min entre tours.',
      exercises: {
        create: [
          {
            exerciseId: pushUpsExplosiveNegative.id,
            order: 1,
            sets: 3,
            reps: 12,
            restSec: 30,
            circuitIndex: 1,
            circuitOrder: 1,
          },
          {
            exerciseId: pushUpsDiamond.id,
            order: 2,
            sets: 3,
            reps: 12,
            restSec: 30,
            circuitIndex: 1,
            circuitOrder: 2,
          },
          {
            exerciseId: pushUpsArcherAlternating.id,
            order: 3,
            sets: 3,
            reps: 10,
            restSec: 30,
            circuitIndex: 1,
            circuitOrder: 3,
          },
          {
            exerciseId: pushUpsShoulderTap.id,
            order: 4,
            sets: 3,
            reps: 12,
            restSec: 30,
            circuitIndex: 1,
            circuitOrder: 4,
          },
          {
            exerciseId: pushUpsFlying.id,
            order: 5,
            sets: 3,
            reps: 10,
            restSec: 30,
            circuitIndex: 1,
            circuitOrder: 5,
          },
          {
            exerciseId: pushUpsClassic.id,
            order: 6,
            sets: 3,
            reps: 15,
            restSec: 120,
            circuitIndex: 1,
            circuitOrder: 6,
          },
        ],
      },
    },
  });

  // Circuit PEC + TRICEPS
  const pecTriceps = await prisma.workout.create({
    data: {
      name: 'Circuit pec + triceps',
      type: WorkoutType.CIRCUIT,
      isPublic: true,
      description:
        '7 exos, 3–4 tours, 2min entre tours (20–30s entre exos possible).',
      exercises: {
        create: [
          {
            exerciseId: pushUpsExplosiveNegative.id,
            order: 1,
            sets: 3,
            reps: 12,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 1,
          },
          {
            exerciseId: dips.id,
            order: 2,
            sets: 3,
            reps: 12,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 2,
          },
          {
            exerciseId: pushUpsDiamond.id,
            order: 3,
            sets: 3,
            reps: 12,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 3,
          },
          {
            exerciseId: pushUps90.id,
            order: 4,
            sets: 3,
            reps: 8,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 4,
          },
          {
            exerciseId: tricepsExtensionFloor.id,
            order: 5,
            sets: 3,
            reps: 9,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 5,
          },
          {
            exerciseId: pushUpsExplosiveFeetElevated.id,
            order: 6,
            sets: 3,
            reps: 12,
            restSec: 20,
            circuitIndex: 1,
            circuitOrder: 6,
          },
          {
            exerciseId: skullCrusher.id,
            order: 7,
            sets: 3,
            reps: 9,
            restSec: 120,
            circuitIndex: 1,
            circuitOrder: 7,
          },
        ],
      },
    },
  });

  console.log('✅ Seed done with workouts:');
  console.log({
    jambes: jambes.id,
    dos: dos.id,
    biceps: biceps.id,
    routinePompes: routinePompes.id,
    pecTriceps: pecTriceps.id,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
