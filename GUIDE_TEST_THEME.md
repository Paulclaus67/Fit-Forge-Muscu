# 🧪 Guide de test - Système de Mode Sombre/Clair

## 🚀 Démarrer l'application

```bash
cd muscu-pwa/frontend
npm run dev
# Accédez à http://localhost:5174
```

---

## 📱 Tests à effectuer

### Test 1 : Chargement initial (IMPORTANT)
**Objectif** : Vérifier qu'il n'y a PAS de flash de contenu

1. Ouvrez `http://localhost:5174/login`
2. **Observer** : Les couleurs doivent être correctes immédiatement
   - ❌ MAUVAIS : Flash blanc puis noir (ou inversé)
   - ✅ BON : Couleur constante dès le chargement

**Pourquoi ?** Le script dans `index.html` applique le thème AVANT React.

---

### Test 2 : Toggle du thème
**Objectif** : Vérifier que le bouton fonctionne

1. Allez à `http://localhost:5174/login`
2. Cherchez le **bouton Soleil/Lune dans le header**
3. Cliquez dessus
4. **Vérifier** :
   - ✅ L'icône change (Soleil ↔ Lune)
   - ✅ Icône tourne au hover
   - ✅ Les couleurs changent progressivement (transition fluide)
   - ✅ Ombre verte apparaît au hover
   - ✅ Le bouton "pulse" au clic (scale)

---

### Test 3 : Persistance du thème
**Objectif** : Vérifier que le thème est sauvegardé

1. Ouvrez DevTools (F12)
2. Allez dans **Console**
3. Exécutez : `localStorage.getItem('app-theme')`
   - ✅ BON : Retourne `'light'` ou `'dark'`
4. Changez le thème
5. Vérifiez à nouveau : la valeur doit avoir changé
6. **Recharger la page** (F5 ou Cmd+R)
7. **Vérifier** : Le thème choisi persiste
   - ❌ MAUVAIS : Revient au thème par défaut
   - ✅ BON : Reste en mode sombre/clair choisi

---

### Test 4 : Couverture de toutes les pages
**Objectif** : Vérifier que le thème s'applique partout

Testez sur chacune de ces pages. À chaque fois :
- Basculez le thème
- Vérifiez que TOUS les éléments changent de couleur

Pages publiques :
- [ ] `/login` - Formulaire de connexion
- [ ] `/register` - Formulaire d'inscription

Pages protégées (vous devez être connecté) :
- [ ] `/` - Dashboard/Aujourd'hui
- [ ] `/workouts` - Liste des séances
- [ ] `/exercises` - Liste des exercices
- [ ] `/profile` - Profil utilisateur
- [ ] `/weekly-plan` - Planning hebdomadaire

Modales/Overlays :
- [ ] Dialog de suppression - Vérifier que le fond change
- [ ] Modals - Vérifier les couleurs

---

### Test 5 : Responsive design
**Objectif** : Vérifier que le bouton s'adapte à la taille

1. Ouvrez DevTools (F12)
2. Activez le mode responsive (Ctrl+Shift+M)
3. Testez sur différentes résolutions :

**Mobile (< 640px)** :
- [ ] Bouton montre uniquement l'icône (Soleil/Lune)
- [ ] Pas de texte "Clair/Sombre"

**Tablet (640px - 1024px)** :
- [ ] Bouton montre icône + texte
- [ ] Le tout est lisible

**Desktop (> 1024px)** :
- [ ] Bouton montre icône + texte
- [ ] Beaucoup de space

---

### Test 6 : Composants UI

#### Cards
```tsx
<Card>Contenu</Card>
```
- [ ] Mode clair : fond blanc, bordure grise
- [ ] Mode sombre : fond slate-900, bordure slate-800
- [ ] Transition fluide

#### Buttons
```tsx
<PrimaryButton>Cliquer</PrimaryButton>
<SecondaryButton>Cliquer</SecondaryButton>
```
- [ ] Couleurs correctes
- [ ] Texte lisible
- [ ] Hover fonctionne

#### Dialog
- [ ] Overlay visible (semi-transparent)
- [ ] Contenu lisible
- [ ] Boutons correctement stylisés

#### Scrollbar (si contenu long)
- [ ] Mode clair : scrollbar grise
- [ ] Mode sombre : scrollbar plus foncée
- [ ] Transition fluide

---

### Test 7 : Détection de préférence système
**Objectif** : Vérifier que l'app respecte les préférences d'OS

**Pour Chrome/Edge :**
1. Allez dans **Settings > Appearance**
2. Changez le theme de Windows
3. Rechargez l'app
4. **Vérifier** : L'app adapte automatiquement le thème

**Pour macOS :**
1. Allez dans **System Preferences > General**
2. Changez Light/Dark
3. Rechargez l'app
4. **Vérifier** : L'app adapte automatiquement

**Pour Firefox :**
1. Allez dans **about:preferences**
2. Cherchez "Website appearance"
3. Testez différentes options
4. **Vérifier** : L'app respecte la préférence

---

### Test 8 : DevTools inspection

**Vérifier l'HTML :**
```html
<!-- Mode clair : -->
<html data-theme="light" style="">

<!-- Mode sombre : -->
<html data-theme="dark" class="dark" style="">
```

**Vérifier localStorage :**
```javascript
localStorage.getItem('app-theme')  // 'light' ou 'dark'
```

**Vérifier le CSS appliqué :**
1. Inspecter un élément
2. Chercher les classes `dark:`
3. Vérifier qu'elles s'appliquent/retirent

---

### Test 9 : Performance

**Mesurer le temps de chargement :**
1. Ouvrir DevTools > Network
2. Recharger
3. **Vérifier** :
   - [ ] Pas de script volumineux supplémentaire
   - [ ] Temps de chargement < 2s
   - [ ] Pas de dépendances externes pour le thème

**Vérifier la taille du CSS :**
- Le CSS devrait rester petit
- Classes Tailwind générées seulement une fois

---

### Test 10 : Accessibilité

**Clavier :**
- [ ] Appuyez sur Tab pour naviguer jusqu'au bouton
- [ ] Appuyez sur Enter pour l'activer
- [ ] Focus visible sur le bouton

**Screen reader :**
- [ ] Bouton a un `aria-label` : "Basculer thème"
- [ ] Bouton a un `title` : "Passer en mode clair/sombre"
- [ ] Texte descriptif présent

**Contraste :**
- [ ] Texte lisible en mode clair
- [ ] Texte lisible en mode sombre
- [ ] Ratio de contraste WCAG AA (4.5:1 minimum)

---

## 🐛 Troubleshooting

### Problème : Flash de contenu au chargement
**Solution** :
- Vérifiez que le script dans `index.html` s'exécute
- Contrôlez la Network tab : le script devrait être chargé en premier
- Videz le cache du navigateur (Ctrl+Shift+Delete)

### Problème : localStorage vide
**Vérifications** :
- [ ] JavaScript activé
- [ ] localStorage non bloqué
- [ ] Pas en mode incognito
- [ ] Domaine correct

### Problème : Thème non appliqué sur une page
**Vérifications** :
- [ ] Page utilise `<Layout>` ou classe `dark:`
- [ ] Classes Tailwind présentes
- [ ] Pas de CSS personnalisé qui override
- [ ] Tailwind.config.js a `darkMode: "class"`

### Problème : Bouton ne bascule pas
**Vérifications** :
- [ ] `useTheme()` hook importé correctement
- [ ] Component à l'intérieur de `<ThemeProvider>`
- [ ] onClick attaché au bouton
- [ ] Console sans erreur (F12)

---

## ✅ Checklist finale

- [ ] Test 1 : Pas de flash au chargement
- [ ] Test 2 : Bouton toggle fonctionne
- [ ] Test 3 : localStorage persiste
- [ ] Test 4 : Toutes pages testées
- [ ] Test 5 : Responsive OK
- [ ] Test 6 : Composants stylisés
- [ ] Test 7 : Préférence système OK
- [ ] Test 8 : HTML/CSS correct
- [ ] Test 9 : Performance OK
- [ ] Test 10 : Accessible

---

## 🎯 Critères de succès

✅ **SUCCÈS** si :
- Aucun flash de contenu
- Thème change de manière fluide
- Persiste après rechargement
- S'applique à toutes les pages
- Responsive sur tous les appareils
- Accessible via clavier
- Performance optimale

❌ **ÉCHEC** si :
- Flash blanc/noir au chargement
- Transitions saccadées
- Thème revient à défaut après rechargement
- Certaines pages non affectées
- Bouton inaccessible au clavier

---

## 📊 Résultats de test

Remplissez après avoir testé :

```
Date : ___________
Navigateur : ___________
OS : ___________
Résolution : ___________

Tests réussis : _____ / 10
Problèmes rencontrés : 
_________________________________
_________________________________

Observations additionnelles :
_________________________________
_________________________________
```

---

**Bon testing ! 🚀**

Si vous rencontrez des problèmes, vérifiez d'abord la console (F12) pour les erreurs JavaScript.
