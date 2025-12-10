# ✨ Points de validation critiques

## 🎯 Avant tests manuels

### ✅ Code check
- [x] Compilation TypeScript réussie
- [x] Build Vite réussi
- [x] Pas d'erreurs dans la console
- [x] Imports correctement nettoyés
- [x] Pas de variables non-utilisées

### ✅ Logique vérifiée
- [x] Logique binaire `restRemaining !== null ? REPOS : EXÉCUTION`
- [x] Handlers existants conservés
- [x] Pas d'API call ajoutée
- [x] localStorage inchangé
- [x] Wake Lock maintenu

### ✅ UX
- [x] Hiérarchie visuelle claire
- [x] Menu avancé caché par défaut
- [x] Reset explicitement nommé et isolé
- [x] CTA dynamique (contexte-aware)
- [x] Navigation secondaire discrète

---

## 🔍 Tests manuels requis

### Test #1: Lancer une séance
**Chemin:** Dashboard → Clic séance → "Commencer"

**Attendu:**
- ✅ Résumé affiche bien la séance
- ✅ Bouton "Commencer la séance" visible
- ✅ Après clic → EXÉCUTION s'affiche
- ✅ Pas de scroll pour voir l'essentiel
- ✅ Exercice 1 affichée correctement

---

### Test #2: État Exécution - Affichage
**Chemin:** Exécution de la première série

**Vérifier:**
- ✅ Titre exercice **GROS**
- ✅ Repères: "Exercice 1/Y • Série 1/X" visible
- ✅ Grille 3 colonnes (Séries, Reps, Durée) présente
- ✅ Notes techniques si existe (pas trop gros)
- ✅ "À suivre: [prochain exo]" en une ligne
- ✅ CTA en bas: "Série terminée" (vert, gros)
- ✅ Navigation petite en bas

---

### Test #3: Transition Exécution → Repos
**Chemin:** Clic "Série terminée" en exécution

**Vérifier:**
- ✅ Page change → REPOS s'affiche
- ✅ Exercice actuel reste visible en haut
- ✅ Repères: "Exercice 1/Y • Série 2/X" (série incrémentée)
- ✅ Chrono **GÉANT** apparaît au centre
- ✅ Affiche le temps de repos initial (ex: 00:45)
- ✅ Statut: "⏳ En cours..." (car restRunning=true)
- ✅ Chrono **décrémente** (pas figé)
- ✅ Animation pulse sur les chiffres (subtile)

---

### Test #4: État Repos - Boutons
**Chemin:** En mode repos

**Vérifier:**
- ✅ Bouton "Pause" visible (pas "Démarrer")
- ✅ Clic "Pause" → statut devient "⏸ En pause"
- ✅ Chrono s'arrête de décrémenter
- ✅ Clic "Pause" à nouveau → "Reprendre" s'affiche
- ✅ Chrono reprend
- ✅ Bouton "+15s" visible et fonctionnel
- ✅ Clic "+15s" → chrono ajoute 15 secondes

---

### Test #5: Menu "Détails & options"
**Chemin:** État repos, clic sur "▶ Détails & options"

**Vérifier:**
- ✅ Flèche devient ▼
- ✅ Menu se déplie
- ✅ Affiche notes techniques (si existe)
- ✅ Bouton "⟲ Réinitialiser le chrono" visible (rouge)
- ✅ Clic à nouveau → menu se referme
- ✅ Flèche redevient ▶

---

### Test #6: Reset chrono (CRITIQUE)
**Chemin:** Menu "Détails & options" ouvert

**Vérifier:**
- ✅ Clic "⟲ Réinitialiser le chrono"
- ✅ Chrono remet à zéro (temps de repos initial)
- ✅ Chrono **en pause** (restRunning=false)
- ✅ ⚠️ **La série n'est PAS réinitialisée** (exercice 1/Y • Série 2/X reste)
- ✅ Progression de la séance intacte

**Vérification supplémentaire:**
1. Faire Reset chrono
2. Fermer menu
3. Clic "Série suivante"
4. Vérifier que vous êtes à Série 3/X (pas revenue à Série 2)

---

### Test #7: Fin du chrono
**Chemin:** Attendre la fin du timer

**Vérifier:**
- ✅ Chrono décrémente jusqu'à 00:00
- ✅ Statut devient "✅ Repos terminé!"
- ✅ Bouton "Série suivante" reste clickable
- ✅ Pas d'auto-advance (l'utilisateur clique)

---

### Test #8: Transition Repos → Exécution
**Chemin:** Clic "Série suivante" après repos

**Vérifier:**
- ✅ Page change → EXÉCUTION s'affiche
- ✅ Repères passent à "Exercice 1/Y • Série 2/X" (même exercice, série +1)
- ✅ Chrono disparaît
- ✅ Bouton devient "Série terminée"
- ✅ Exercice reste le même (pas d'auto-advance)

---

### Test #9: Navigation exercices
**Chemin:** Cliquer "← Précédent" ou "Suivant →"

**Vérifier:**
- ✅ Boutons sont petits et discrets
- ✅ "Précédent" désactivé si exercice 1
- ✅ "Suivant" désactivé si dernier exercice
- ✅ Clic navigue correctement
- ✅ Repères mettent à jour (exercice X/Y)
- ✅ État (exécution/repos) préservé
- ✅ Série actuelle reste la même

---

### Test #10: Passage à l'exercice suivant
**Chemin:** Dernier exercice, dernière série, fin repos

**Vérifier:**
- ✅ Clic "Série suivante"
- ✅ Page change → EXÉCUTION
- ✅ Exercice change (ex: 1 → 2)
- ✅ Série remet à 1 (première série du nouvel exo)
- ✅ Repères: "Exercice 2/Y • Série 1/X"
- ✅ Nouveau chrono de repos quand "Série terminée" cliqué

---

### Test #11: Fin de séance
**Chemin:** Dernier exercice, dernière série, "Série terminée"

**Vérifier:**
- ✅ Pas d'exo suivante → pas de repos
- ✅ Page affiche un écran "Séance terminée"
- ✅ Ou retour auto au résumé
- ✅ Progression sauvegardée
- ✅ Chrono global arrêté

---

### Test #12: Quitter la séance
**Chemin:** Clic [X] en haut à gauche

**Vérifier:**
- ✅ Dialog de confirmation apparaît
- ✅ Boutons "Confirmer" et "Annuler"
- ✅ Clic "Annuler" → retour à la séance
- ✅ Clic "Confirmer" → retour au Dashboard
- ✅ localStorage nettoyé (pas de session active)

---

### Test #13: Récap après interruption
**Chemin:** Quitter et relancer la même séance

**Vérifier:**
- ✅ Progression restaurée (exercice et série)
- ✅ Pas de re-démarrage à zéro
- ✅ Choix: continuer ou recommencer

---

## 📱 Tests responsifs

### Mobile (375px)
- [ ] Chrono lisible
- [ ] Pas de débordement
- [ ] Boutons accessibles (48px min)
- [ ] Pas de scroll

### Mobile (414px)
- [ ] Chrono adapté
- [ ] Layout OK

### Landscape (375x667)
- [ ] Chrono redimensionné
- [ ] Layout optimisé
- [ ] Pas de perte d'éléments

### Tablet (768px+)
- [ ] Chrono grand mais pas excessif
- [ ] Espaces adapté
- [ ] Pas de gaspillage d'espace

---

## 🌓 Tests thème

### Dark mode
- [ ] Texte lisible
- [ ] Chrono visible
- [ ] Boutons contrastés
- [ ] Animation pulse OK

### Light mode
- [ ] Idem

### System preference
- [ ] Suit la préférence système

---

## ⚠️ Cas d'erreur

### Si tout ne s'affiche pas
```
1. Vérifier console (F12)
2. Vérifier que exerciceIndex < workout.exercises.length
3. Vérifier que setNumber > 0
4. Vérifier que restRemaining === null ou number
```

### Si les transitions ne passent pas
```
1. Vérifier handleCompleteSet() est appelé
2. Vérifier que setRestRemaining() fonctionne
3. Vérifier que setNumber est incrémenté
```

### Si Reset ne fonctionne pas
```
1. Vérifier handleResetRest() est appelé
2. Vérifier que nextExercise.restSec existe
3. Vérifier que setRestRemaining() est mis à jour
4. Vérifier que setRestRunning(false) fonctionne
```

### Si le chrono ne décrémente pas
```
1. Vérifier que restRunning === true
2. Vérifier le useEffect() du chrono
3. Vérifier que setRestRemaining() est appelé chaque seconde
4. Vérifier qu'il n'y a pas d'erreur dans la console
```

---

## 🎯 Validation finale

Checklist avant sign-off:

- [ ] Test #1-13 tous passés
- [ ] Responsive OK (mobile+tablet+desktop)
- [ ] Thème OK (dark+light)
- [ ] Pas d'erreur console
- [ ] Reset chrono ne touche pas progression
- [ ] Tous les handlers fonctionnent
- [ ] Pas de regression sur autre page
- [ ] Documentation lue et comprise
- [ ] Prêt pour déploiement

---

**Once all tests pass → Ready to deploy! 🚀**

