// resetUserPlan.ts - Script pour supprimer et recréer le planning d'un utilisateur
import { prisma } from './src/prismaClient';
import { setupDefaultProgram } from './src/utils/setupDefaultProgram';

async function main() {
  const userId = 1; // utilisateur test
  
  console.log(`🗑️  Suppression de l'ancien planning de l'utilisateur ${userId}...`);
  await prisma.weeklyPlan.deleteMany({
    where: { userId },
  });
  
  console.log(`📝 Création du nouveau planning...`);
  await setupDefaultProgram(userId);
  
  console.log('✅ Planning recréé avec succès !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
