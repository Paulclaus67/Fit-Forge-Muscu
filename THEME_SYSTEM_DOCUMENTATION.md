# 🎨 Système de Mode Sombre/Clair - Documentation

## Vue d'ensemble

Votre application dispose maintenant d'un **système de thème complet et fluide** qui permet aux utilisateurs de basculer entre le mode clair et le mode sombre. Le thème s'applique à **toute l'application** et se souvient de la préférence de l'utilisateur.

---

## ✨ Fonctionnalités

### 1. **Contrôle centralisé du thème**
- **Bouton de toggle** dans le header avec icône (Lune/Soleil)
- Disponible sur **toutes les pages** de l'application
- Le bouton remplace la "pastille béta" précédente

### 2. **Persistance du thème**
- Les préférences sont sauvegardées dans `localStorage`
- Clé de stockage : `app-theme`
- Le thème persiste à travers les rechargements de page

### 3. **Détection des préférences système**
- Au premier lancement, l'app détecte la préférence sombre du système
- Utilise `window.matchMedia('(prefers-color-scheme: dark)')`
- Respecte les paramètres d'accessibilité de l'OS

### 4. **Transitions fluides**
- Passage du thème sans "flash" au chargement
- Transitions CSS douces (0.3s) lors du basculement
- Animations de bouton avec rotation d'icône au hover

### 5. **Couverture complète**
- **Pages protégées** : Dashboard, Workouts, Exercises, Profile, WeeklyPlan
- **Pages publiques** : Login, Register
- **Composants UI** : Card, Button, Dialog, Layout
- **Scrollbars** : Adaptées au thème

---

## 🏗️ Architecture technique

### Structure des fichiers modifiés

```
frontend/
├── src/
│   ├── context/
│   │   └── ThemeContext.tsx          # Gestion centralisée du thème
│   ├── components/
│   │   └── Layout.tsx                # Bouton toggle amélioré
│   ├── index.css                     # Styles globaux + transitions
│   ├── App.tsx                       # Fourni ThemeProvider
│   └── main.tsx
├── index.html                        # Script d'init rapide du thème
└── public/
    └── manifest.webmanifest          # Métadonnées PWA
```

### 1. **ThemeContext.tsx** - Gestion d'état

```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

**Responsabilités :**
- État du thème avec réactivité React
- Gestion localStorage avec fallback système
- Manipulation de la classe CSS `dark` sur le documentElement
- Attribut `data-theme` sur l'élément root

**Utilisation :**
```tsx
const { theme, toggleTheme } = useTheme();
```

### 2. **Layout.tsx** - Bouton de control

Le bouton dans le header offre :
- **Icônes dynamiques** : Soleil (mode clair) ↔ Lune (mode sombre)
- **Animations visuelles** :
  - Rotation d'icône au hover
  - Scale au click
  - Ombre émeraude lors du hover
- **Responsive** : Texte caché sur mobile, uniquement icône

```tsx
<button
  onClick={toggleTheme}
  className="group inline-flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border..."
>
  {theme === 'dark' ? (
    <SunIcon className="w-4 h-4 transition-transform group-hover:rotate-12" />
  ) : (
    <MoonIcon className="w-4 h-4 transition-transform group-hover:-rotate-12" />
  )}
  <span className="hidden sm:inline">{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
</button>
```

### 3. **index.css** - Styles globaux

Les transitions sont appliquées au :
- **Element `<html>`** : Transition rapide (0.3s) du `color-scheme`
- **Body** : Transition lisse des couleurs
- **Scrollbars** : Adaptation au thème avec transition

```css
:root {
  color-scheme: light;
  transition: background-color 0.3s ease, color 0.3s ease, color-scheme 0.3s ease;
}

.dark {
  color-scheme: dark;
  background-color: rgb(2 6 23);
  color: rgb(248 250 252);
}
```

### 4. **index.html** - Script d'initialisation

Un script inline s'exécute **avant React** pour éviter les flashs :

```html
<script>
  (function() {
    const STORAGE_KEY = 'app-theme';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (e) {
      // Fallback système
    }
  })();
</script>
```

**Avantages :**
- ✅ Exécution immédiate
- ✅ Pas de dépendance React
- ✅ Évite les re-renders inutiles
- ✅ Chargement rapide du DOM

---

## 🎯 Utilisation dans les composants

### Utiliser le hook `useTheme`

```tsx
import { useTheme } from '../context/ThemeContext';

const MyComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Thème actuel : {theme}</p>
      <button onClick={toggleTheme}>Basculer</button>
    </div>
  );
};
```

### Utiliser les classes Tailwind `dark:`

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
  Contenu adapté au thème
</div>
```

### Couleurs de référence

| Élément | Clair | Sombre |
|---------|-------|--------|
| Background | `#f8fafc` (slate-50) | `rgb(2 6 23)` (slate-950) |
| Texte | `#0f172a` (slate-900) | `rgb(248 250 252)` (slate-50) |
| Cartes | `white` | `slate-900` |
| Bordures | `slate-200` | `slate-800` |

---

## 🚀 Performance & Optimisation

### ✅ Sans flash au chargement
- Script d'init dans `index.html` s'exécute avant React
- Classe `dark` appliquée instantanément
- Pas de contenu FOUC (Flash of Unstyled Content)

### ✅ Transitions fluides
- Duration : 0.3s (assez rapide pour être réactif)
- Easing : `ease` (naturelle)
- Appliquées sur : background, color, color-scheme

### ✅ Léger & performant
- ≈ 2KB JavaScript pour ThemeContext
- Stockage localStorage (~10 bytes)
- Pas de requête API nécessaire

---

## 📱 Responsive Design

Le bouton s'adapte aux écrans :
- **Mobile** : Icône uniquement (4h x 4h)
- **Tablette+** : Icône + Texte

```tsx
<span className="hidden sm:inline">{texte}</span>
```

---

## 🧪 Test

Pour tester le système :

1. **Ouvrir l'app** : http://localhost:5174/
2. **Cliquer le bouton** dans le header (Soleil/Lune)
3. **Observer** :
   - Transition fluide des couleurs
   - Icône qui tourne
   - Ombre émeraude au hover
4. **Recharger la page** : Le thème choisi persiste
5. **Checker localStorage** : `app-theme` = `'light'` ou `'dark'`

---

## 🔧 Customisation future

### Ajouter de nouveaux thèmes

Modifier `ThemeContext.tsx` :
```tsx
type Theme = 'light' | 'dark' | 'auto';
```

### Ajouter des teintes supplémentaires

Modifier `tailwind.config.js` :
```javascript
theme: {
  extend: {
    colors: {
      custom: {
        light: '#...',
        dark: '#...',
      }
    }
  }
}
```

### Synchroniser avec système

Ajouter un listener :
```tsx
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Réagir au changement système
});
```

---

## 📝 Résumé des modifications

### Fichiers modifiés

1. ✅ `frontend/src/index.css`
   - Ajouté transition sur `:root`
   - Ajouté styles dark pour body
   - Improved scrollbar styling

2. ✅ `frontend/src/context/ThemeContext.tsx`
   - Amélioration des commentaires
   - Optimisation logique

3. ✅ `frontend/src/components/Layout.tsx`
   - Bouton theme amélioré
   - Icônes avec animations
   - Responsive design

4. ✅ `frontend/index.html`
   - Script d'initialisation rapide
   - Prévention des flashs

5. ✅ `frontend/public/manifest.webmanifest`
   - Métadonnées PWA enrichies
   - Support des shortcuts

---

## ✨ Prochaines étapes possibles

- [ ] Ajouter des animations de transition plus sophistiquées
- [ ] Implémenter d'autres variantes de thème (bleu, vert, etc.)
- [ ] Créer une page de paramètres pour plus d'options
- [ ] Analytics : tracker les préférences utilisateur
- [ ] Tester sur navigateurs mobiles (iOS Safari, Chrome mobile)

---

**Développé pour l'app Muscu PWA** 💪
Version : 1.0.0 | Date : Décembre 2025
