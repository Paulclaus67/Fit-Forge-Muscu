# Guide de Test - Refonte UX Séance

## 🎯 Objectif
Tester la nouvelle interface de séance avec deux états simplifiés et une ergonomie optimisée pour l'entraînement.

## 📋 Points de test critiques

### Test 1: Affichage état "Exécution"
**Où :** Lancer une séance, avant de cliquer "Série terminée"

**Attendu :**
- ✅ Exercice actuel visible en gros (ex: "Pistol Squat")
- ✅ Repères: "Exercice 1/2 • Série 1/4"
- ✅ Grille 3 colonnes : Séries (4), Reps (10), ou Durée
- ✅ Notes techniques visible (si présentes)
- ✅ Prochain exercice en ligne simple (pas de bloc gros)
- ✅ Pas de scroll pour voir tout l'essentiel
- ✅ Bouton en bas: "Série terminée" (gros, vert)
- ✅ Boutons petits en bas: "← Précédent" et "Suivant →" (discrets)

### Test 2: Affichage état "Repos"
**Où :** Après avoir cliqué "Série terminée"

**Attendu :**
- ✅ Même structure top (Exercice actuel + série/exercice)
- ✅ Chrono GÉANT au centre: 00:45 (avec animation pulse)
- ✅ Texte d'état: "⏳ En cours..." ou "⏸ En pause"
- ✅ Bouton "Pause" ou "Reprendre" (pas "Démarrer")
- ✅ Bouton "+15s" visible
- ✅ Menu pliant "▶ Détails & options" (fermé par défaut)
- ✅ Pas de "Reset" en gros bouton
- ✅ Bouton en bas: "Série suivante" (gros, vert)

### Test 3: Menu "Détails & options"
**Où :** Cliquer sur "▶ Détails & options" en mode repos

**Attendu :**
- ✅ Le menu se déplie (flèche devient ▼)
- ✅ Affiche: Notes techniques + bouton "⟲ Réinitialiser le chrono"
- ✅ Le bouton Reset est rouge pour indiquer le danger
- ✅ Cliquer à nouveau ferme le menu (flèche redevient ▶)

### Test 4: Bouton "Réinitialiser le chrono"
**Où :** Menu "Détails & options" en mode repos, cliquer le bouton rouge

**Attendu :**
- ✅ Le chrono remet à zéro (au temps de repos initial de l'exercice suivant)
- ✅ ⚠️ Cela NE doit PAS réinitialiser l'exercice entier
- ✅ La série en cours continue à être enregistrée
- ✅ Le libellé clair "Réinitialiser le chrono" (pas juste "Reset")

### Test 5: Navigation exercices
**Où :** Cliquer "← Précédent" ou "Suivant →" pendant la séance

**Attendu :**
- ✅ Les boutons sont petits, en bas, discrets
- ✅ "Précédent" est désactivé si exercice 1
- ✅ "Suivant" est désactivé si dernier exercice
- ✅ Cliquer navigue correctement l'exercice
- ✅ Pas de gros risque d'erreur (petite taille)

### Test 6: Responsive mobile
**Où :** Sur un téléphone réel (ou DevTools mobile)

**Attendu :**
- ✅ Chrono lisible même sur petit écran
- ✅ Pas de scroll horizontal
- ✅ Boutons large et facilement accessibles (48px min)
- ✅ En landscape : chrono redimensionné pour laisser de la place
- ✅ Pas de zoom accidentel
- ✅ Mains moites : interface ne glisse pas

### Test 7: Transitions et animations
**Où :** Passer de "Exécution" à "Repos"

**Attendu :**
- ✅ Le changement est fluide
- ✅ Chrono apparaît progressivement
- ✅ Animation pulse sur le chrono (subtile, pas aggressive)
- ✅ Pas de lag ou freeze

### Test 8: Bouton "Série suivante" vs "Série terminée"
**Où :** Observer le label du CTA principal

**Attendu :**
- ✅ En mode Exécution : "Série terminée"
- ✅ En mode Repos : "Série suivante"
- ✅ Le sens est immédiatement clair

### Test 9: Fin du repos
**Où :** Attendre la fin du timer

**Attendu :**
- ✅ À 00:00, le texte devient "✅ Repos terminé!"
- ✅ Bouton "Série suivante" reste clickable
- ✅ OU le bouton se désactive si auto-advance prévu

### Test 10: Quitter la séance
**Où :** Cliquer le X en haut à gauche

**Attendu :**
- ✅ Confirmation dialog
- ✅ Confirm = retour à la liste séances
- ✅ Cancel = retour à la séance en cours

---

## 🎨 Vérifications visuelles

### Hiérarchie visuelle
- [ ] Exercice actuel : **très gros** (tête d'écran)
- [ ] Chrono repos : **très gros** (dominae l'écran)
- [ ] CTA principal : **gros et vert**
- [ ] Navigation exercices : **petit, discret**
- [ ] Options avancées : **petits boutons cachés par défaut**

### Clarté du sens
- [ ] Aucune confusion entre "Réinitialiser chrono" et "Annuler progression"
- [ ] Le terme "Réinitialiser le chrono" est explicite
- [ ] "Exercice suivant" (petit) vs "Série suivante" (gros) bien distincts

### Pas de surprises
- [ ] Chaque bouton fait exactement ce qu'il dit
- [ ] Pas d'action cachée ou contre-intuitive
- [ ] Zone "dangers" (Reset) bien isolée et avertie (rouge)

---

## 🔄 Workflow complet pour valider

1. **Entrer en séance** → Voir le récap
2. **"Commencer la séance"** → Entrer en État Exécution
3. **Voir l'exercice 1** → Vérifier affichage clair
4. **Cliquer "Série terminée"** → Passer à État Repos
5. **Voir le chrono** → Vérifier animation pulse
6. **Attendre 5 secondes** → Vérifier que chrono diminue
7. **Cliquer "Pause"** → Chrono s'arrête
8. **Cliquer "Reprendre"** → Chrono redémarre
9. **Cliquer "+15s"** → Chrono ajoute 15 secondes
10. **Cliquer "▶ Détails"** → Menu se déplie
11. **Cliquer "⟲ Réinit..."** → Chrono remet à zéro (test que progression série n'est PAS annulée)
12. **Cliquer "▼ Détails"** → Menu se referme
13. **Attendre fin du timer** → Voir "✅ Repos terminé!"
14. **Cliquer "Série suivante"** → Passer à l'exercice suivant
15. **Vérifier État Exécution** → Maintenant c'est "Série 2/4"
16. **Naviguer "← Précédent"** → Retour à l'exercice 1 (vérifier que la progression n'est pas annulée)
17. **Cliquer "Quitter"** → Voir confirmation
18. **Cliquer "Confirmer"** → Retour au dashboard

---

## 🐛 Bugs à éviter

| Bug | Vérification |
|-----|-------------|
| Reset chrono réinitialise l'exercice | Vérifier la progression après reset |
| Scroll pendant le repos | Vérifier que tout tient sans scroll |
| Bouton "Reprendre" = "Démarrer" | Texte clair, pas ambigu |
| Chrono trop petit sur mobile | Tester sur téléphone réel |
| Miss-tap sur navigation exercices | Boutons suffisamment espacés |
| Menu pliant ne se ferme pas | Tester ouvrir/fermer plusieurs fois |

---

## 📱 Breakpoints testés

- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro (393px)
- [ ] Samsung Galaxy S10 (360px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Tablet landscape
- [ ] Desktop (juste pour vérifier pas de regression)

---

## ✅ Sign-off

Une fois tous les tests passés, cocher:
- [ ] État Exécution correct
- [ ] État Repos correct
- [ ] Menu avancé fonctionnel
- [ ] Reset chrono danger isolé
- [ ] Navigation secondaire discrète
- [ ] Responsive OK
- [ ] Pas de surprises UX
- [ ] Prêt pour production

