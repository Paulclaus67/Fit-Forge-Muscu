// Script temporaire pour ajouter le programme à un utilisateur existant
const { PrismaClient } = require('@prisma/client');
const { setupDefaultProgram } = require('./src/utils/setupDefaultProgram');

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  
  if (!username) {
    console.log('Usage: node setupUserProgram.js <username>');
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    console.log(`❌ Utilisateur "${username}" introuvable`);
    process.exit(1);
  }

  console.log(`📝 Création du programme pour l'utilisateur "${username}" (ID: ${user.id})...`);
  
  try {
    await setupDefaultProgram(user.id);
    console.log('✅ Programme créé avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
