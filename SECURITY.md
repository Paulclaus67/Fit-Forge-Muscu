# 🔒 Politique de Sécurité

## 🛡️ Versions Supportées

| Version | Support         |
| ------- | --------------- |
| 1.0.x   | ✅ Supporté     |
| < 1.0   | ❌ Non supporté |

## 🚨 Signaler une Vulnérabilité

La sécurité de Fit Forge Muscu est prise très au sérieux. Si vous découvrez une vulnérabilité de sécurité, merci de nous aider à la résoudre de manière responsable.

### Comment signaler

**⚠️ NE PAS créer d'issue publique pour les vulnérabilités de sécurité.**

Au lieu de cela :

1. **Email** : Envoyez un email avec les détails à [votre-email@example.com]
2. Incluez :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correctifs (si disponibles)

### Ce que nous promettons

- **Réponse rapide** : Accusé de réception sous 48h
- **Mise à jour régulière** : Vous serez tenu informé de l'avancement
- **Crédit** : Reconnaissance publique (si vous le souhaitez)
- **Résolution** : Correctif publié dès que possible

### Délais de réponse

- Première réponse : **48 heures**
- Résolution critique : **7 jours**
- Résolution haute priorité : **14 jours**
- Résolution moyenne : **30 jours**

## 🔐 Bonnes Pratiques de Sécurité

### Pour les Développeurs

1. **Variables d'environnement**
   - Ne committez JAMAIS de fichiers `.env`
   - Utilisez `.env.example` comme template
   - Changez toutes les clés secrètes en production

2. **Dépendances**
   - Exécutez régulièrement `npm audit`
   - Mettez à jour les dépendances vulnérables
   - Utilisez `npm audit fix` pour les correctifs automatiques

3. **Authentification**
   - Les mots de passe sont hashés avec bcrypt
   - Les tokens JWT ont une expiration
   - Validation des entrées utilisateur

4. **Base de données**
   - Utilisation de Prisma ORM (protection SQL injection)
   - Validation des données avant insertion
   - Sanitisation des entrées

### Pour les Utilisateurs

1. **Mots de passe**
   - Utilisez des mots de passe forts (8+ caractères)
   - Combinez lettres, chiffres et symboles
   - Ne réutilisez pas les mots de passe

2. **Compte**
   - Déconnectez-vous sur les appareils partagés
   - Ne partagez pas vos identifiants
   - Signalez toute activité suspecte

## 🔍 Audit de Sécurité

### Vérifications automatiques

Le projet utilise :
- **npm audit** - Scan des vulnérabilités de dépendances
- **GitHub Dependabot** - Alertes de sécurité automatiques
- **TypeScript strict mode** - Vérifications de type strictes

### Exécuter un audit local

```bash
# Audit des dépendances
cd backend && npm audit
cd ../frontend && npm audit

# Audit avec correctifs automatiques
npm audit fix

# Audit pour les dépendances de production uniquement
npm audit --production
```

## 🛠️ Configuration Sécurisée

### Production

Variables d'environnement recommandées :

```env
# FORT et UNIQUE pour chaque installation
JWT_SECRET=<générer-avec-crypto.randomBytes(64).toString('hex')>

# Base de données sécurisée
DATABASE_URL=<chemin-sécurisé>

# Mode production
NODE_ENV=production

# Désactiver les logs de debug
DEBUG=false
```

### Headers de sécurité

Le backend devrait implémenter (à venir) :
- Helmet.js pour les headers HTTP sécurisés
- CORS configuré correctement
- Rate limiting pour prévenir les abus
- HTTPS en production

## 📋 Checklist de Sécurité

Avant le déploiement en production :

- [ ] Variables d'environnement configurées et sécurisées
- [ ] JWT_SECRET changé et fort (64+ caractères aléatoires)
- [ ] Base de données protégée et sauvegardée
- [ ] HTTPS activé
- [ ] CORS configuré pour le domaine de production uniquement
- [ ] Logs d'erreurs configurés (sans données sensibles)
- [ ] npm audit exécuté sans vulnérabilités critiques
- [ ] Backups automatiques configurés
- [ ] Monitoring et alertes en place

## 🔗 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📜 Historique des Incidents

Aucun incident de sécurité à ce jour.

---

**Date de dernière mise à jour** : 10 décembre 2025

**Merci de nous aider à garder Fit Forge Muscu sécurisé ! 🔒**
