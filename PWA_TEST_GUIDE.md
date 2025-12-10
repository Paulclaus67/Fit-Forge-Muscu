# 🧪 Guide de Test PWA - FitForge

## ✅ Configuration PWA Actuelle

### Service Worker
- ✅ **Enregistré** dans `main.tsx`
- ✅ **Généré** par Vite PWA plugin (`sw.js`)
- ✅ **Workbox** configuré pour le caching
- ✅ **Auto-update** activé

### Manifest
- ✅ `manifest.webmanifest` configuré
- ✅ Icônes 192x192 et 512x512 (PNG)
- ✅ Mode `standalone` (app fullscreen)
- ✅ Thème couleur `#10b981` (vert)
- ✅ Background `#020617` (dark)
- ✅ Shortcut "Nouvelle séance"

### Stratégies de Cache
- **Assets statiques** : Précachés (605 KB)
- **API calls** : NetworkFirst (10s timeout, 5min cache)
- **Fonts** : CacheFirst (1 an)
- **Images** : CacheFirst (30 jours)

---

## 🧪 Tests à Effectuer

### Test 1 : Installation PWA ⭐
1. **Chrome Desktop** :
   - Ouvrir http://localhost:5173
   - Cliquer sur l'icône ⊕ (installer) dans la barre d'adresse
   - ✅ L'app s'installe et s'ouvre en fenêtre standalone

2. **Chrome Mobile / Android** :
   - Ouvrir l'app dans Chrome
   - Menu ⋮ → "Installer l'application" / "Ajouter à l'écran d'accueil"
   - ✅ Icône apparaît sur l'écran d'accueil
   - ✅ Splash screen avec logo et couleur de thème

3. **Safari iOS** :
   - Ouvrir dans Safari
   - Partager 📤 → "Sur l'écran d'accueil"
   - ✅ Icône ajoutée (192x192)

### Test 2 : Service Worker
1. **DevTools Console** :
   ```javascript
   // Vérifier l'enregistrement
   navigator.serviceWorker.getRegistrations()
   // ✅ Devrait afficher : "✅ PWA: Service Worker registered"
   ```

2. **Chrome DevTools** :
   - F12 → Application → Service Workers
   - ✅ Service Worker actif avec scope "/"
   - ✅ Status "activated and is running"

### Test 3 : Mode Offline 📵
1. **Précaching** :
   - Charger l'app une fois (connecté)
   - DevTools → Application → Cache Storage
   - ✅ Voir "workbox-precache" avec 15 entrées

2. **Fonctionnement Offline** :
   - Charger l'app normalement
   - DevTools → Network → ☑️ "Offline"
   - Rafraîchir la page (F5)
   - ✅ L'app charge sans erreur
   - ✅ UI/CSS/JS fonctionnent
   - ❌ Appels API échouent (normal)

3. **Stratégie NetworkFirst** :
   - En mode offline
   - Naviguer vers des pages déjà visitées
   - ✅ Pages chargent depuis le cache

### Test 4 : Manifest & Icônes
1. **Lighthouse Audit** :
   - F12 → Lighthouse
   - Catégories : ☑️ PWA
   - "Generate report"
   - ✅ Score PWA > 80%

2. **Manifest DevTools** :
   - Application → Manifest
   - ✅ Nom : "FitForge"
   - ✅ Start URL : "/"
   - ✅ Display : "standalone"
   - ✅ Icons : 192x192, 512x512
   - ✅ Theme color : #10b981

### Test 5 : Shortcuts (Android/Windows)
1. **Long press sur l'icône** (Android) :
   - ✅ Voir "Nouvelle séance"
   - Cliquer dessus
   - ✅ Ouvre `/workouts` directement

2. **Clic droit sur l'icône** (Windows) :
   - ✅ Voir le shortcut dans le menu contextuel

### Test 6 : Auto-Update
1. Modifier `frontend/src/App.tsx` (exemple : changer un texte)
2. Rebuilder : `npm run build`
3. Dans l'app installée (sans refresh manuel)
4. ✅ Après quelques secondes, l'app se met à jour automatiquement

---

## 🐛 Résolution de Problèmes

### Service Worker ne s'enregistre pas
```javascript
// Vérifier dans la console
console.log('serviceWorker' in navigator); // doit être true

// Forcer la désinscription
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Vider le cache
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
```

### L'app ne fonctionne pas offline
1. **Vérifier le précache** :
   - DevTools → Application → Cache Storage
   - "workbox-precache-v2..." doit contenir les assets

2. **Forcer le refresh** :
   - Unregister le SW
   - Vider tous les caches
   - Hard refresh (Ctrl+Shift+R)

### Manifest invalide
1. **Tester le manifest** :
   - https://manifest-validator.appspot.com/
   - Coller le contenu de `/manifest.webmanifest`

2. **Icônes manquantes** :
   - Vérifier `/public/icons/icon-192.png` existe
   - Vérifier `/public/icons/icon-512.png` existe

---

## 📊 Checklist de Production

- [x] Service Worker enregistré
- [x] Manifest valide
- [x] Icônes 192x192 et 512x512
- [x] Mode standalone configuré
- [x] Stratégies de cache définies
- [x] Précache des assets critiques
- [x] Auto-update activé
- [x] Thème couleur défini
- [ ] Screenshots ajoutés (optionnel)
- [ ] Icônes WebP (optimisation future)
- [x] HTTPS en production (requis pour PWA)

---

## 🚀 Commandes Utiles

```bash
# Build production avec PWA
npm run build

# Preview du build (avec SW actif)
npm run preview

# Analyser le bundle
npx vite-bundle-visualizer

# Test offline local
# 1. Build
npm run build
# 2. Servir avec cache headers
npx serve dist -s
# 3. Tester offline dans DevTools
```

---

## 📱 PWA Features Actives

✅ **Installable** - Bouton "Installer l'application"
✅ **Offline First** - Fonctionne sans connexion
✅ **Auto-Update** - Mise à jour automatique en background
✅ **Fast Load** - Précaching des assets critiques (605 KB)
✅ **Standalone** - Fullscreen sans barre de navigation
✅ **Theme** - Couleur système #10b981
✅ **Icons** - Icônes adaptatives 192/512
✅ **Shortcuts** - "Nouvelle séance" quick action

⚠️ **À ajouter** (non-critique) :
- Push Notifications (optionnel)
- Background Sync (optionnel)
- Share Target API (optionnel)
- Screenshots pour stores (optionnel)

---

## ✨ Score PWA Attendu

**Lighthouse PWA Audit** :
- ✅ Installable : 100%
- ✅ PWA Optimized : 100%
- ✅ Manifest : Valid
- ✅ Service Worker : Active
- ✅ HTTPS : Required in production
- ✅ Viewport : Configured
- ✅ Icons : Valid

**Score Final Attendu : 100/100** 🎯

---

## 🔗 Ressources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Manifest Validator](https://manifest-validator.appspot.com/)
