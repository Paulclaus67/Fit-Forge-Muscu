# 📋 Checklist de sécurité pour les releases

Avant de déployer une nouvelle version en production, vérifiez:

## Code Review
- [ ] Tous les changements ont été reviewés
- [ ] Pas de code de debug ou de console.log
- [ ] Pas d'informations sensibles dans le code
- [ ] Les dépendances sont à jour

## Tests
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tests manuels effectués
- [ ] Aucun warning dans la console

## Sécurité
- [ ] Pas de vulnérabilités connues (`npm audit`)
- [ ] Authentification fonctionnelle
- [ ] Autorisation vérifiée
- [ ] Données sensibles sont chiffrées

## Performance
- [ ] Lighthouse score > 80
- [ ] Bundle size acceptable
- [ ] Pas de memory leaks
- [ ] Chargement < 3s

## Documentation
- [ ] README mis à jour
- [ ] CHANGELOG mis à jour
- [ ] API documentation à jour
- [ ] Variables d'env documentées

## Déploiement
- [ ] Backup de la base de données effectué
- [ ] Migrations prêtes
- [ ] Rollback plan en place
- [ ] Monitoring configuré

## Post-Déploiement
- [ ] Vérifier les logs de production
- [ ] Confirmer la version déployée
- [ ] Tester les fonctionnalités clés
- [ ] Vérifier les métriques
