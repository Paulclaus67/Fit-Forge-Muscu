#!/usr/bin/env node
/**
 * Script pour générer un JWT Secret sécurisé
 * Usage: node generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Génération d\'un JWT Secret sécurisé...\n');

const secret = crypto.randomBytes(64).toString('hex');

console.log('Votre JWT Secret:');
console.log('━'.repeat(130));
console.log(secret);
console.log('━'.repeat(130));

console.log('\n📝 Instructions:');
console.log('1. Copiez la clé ci-dessus');
console.log('2. Ajoutez-la dans votre fichier .env:');
console.log('   JWT_SECRET=' + secret);
console.log('\n⚠️  ATTENTION:');
console.log('   - Ne partagez JAMAIS cette clé');
console.log('   - Ne la committez JAMAIS dans git');
console.log('   - Utilisez une clé différente pour chaque environnement\n');
