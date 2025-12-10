# Quick Bundle Comparison

## Before (Dev Build - Unminified)
- `react-dom_client.js?v=523b1760`: 981.4 KiB
- `react-router-dom.js?v=523b1760`: 427.2 KiB  
- `@heroicons_react_24_outline.js?v=523b1760`: 342.5 KiB
- `@vite/client`: 174.7 KiB
- `@react-refresh`: 109.3 KiB
- **Total vendor estimated:** ~2,035 KiB (3.56 MiB with all assets)
- **Unused JS:** 1,911 KiB (reported by Lighthouse)
- **Unminified CSS:** 2 KiB savings possible

**Metrics:**
- FCP: 8.2s
- LCP: 15.0s
- TBT: 30ms
- Score: 57

---

## After (Production Build - Minified + Code-Split)
- `react-vendor-BLCQ9ieX.js`: 218.92 KiB (raw), ~71.55 KiB (gzipped)
- `chart-vendor-BZXDIg0E.js`: 141.72 KiB (raw), ~49.76 KiB (gzipped) — **LAZY-LOADED**
- `icons-DBtP-6Nf.js`: 17.81 KiB (raw), ~3.08 KiB (gzipped) — **TREE-SHAKEN**
- DashboardPage: 9.94 KiB (raw), ~3.39 KiB (gzipped)
- Other routes: 0.16–15.4 KiB each — **LAZY-LOADED**
- **Total initial bundle:** ~450 KiB (raw), ~130 KiB (gzipped)
- **Code split reduction:** 78% for main vendor
- **CSS minified:** Yes (included in index CSS)

**Improvements:**
- ✅ JavaScript minified with Terser
- ✅ Console logs dropped
- ✅ All routes lazy-loaded
- ✅ Chart.js deferred (ProfilePage only)
- ✅ @heroicons tree-shaken + isolated
- ✅ Unused JS deferred until route load

---

## Expected Metrics After Rebuild
- **FCP:** 8.2s → 5.5–6.5s (–2.5–3s)
- **LCP:** 15.0s → 9–11s (–4–6s)
- **TBT:** 30ms → 20–25ms (–5–10ms)
- **Performance Score:** 57 → **65–72** (+8–15 points)

---

## How This Helps

### Network Performance
- Fewer bytes to download on first load
- Gzipped bundles reduce bandwidth by ~70%
- Lazy routes only loaded when needed

### Main-Thread Performance  
- Reduced JS parsing time (Terser removes dead code)
- Chunking spreads evaluation across page lifecycle
- Chart.js only evaluated when ProfilePage mounted

### User Experience
- App becomes interactive faster (lower TBT)
- Content paints sooner (lower FCP/LCP)
- Subsequent page navigations faster (chunks cached)

---

## Verify Locally

```bash
# Build
cd frontend
npm run build

# Check sizes
ls -lh dist/assets/*.js | head -15

# Preview production build
npm run preview
# http://localhost:4173

# Run Lighthouse
# Chrome DevTools → Lighthouse → Mobile
```

**Expected build time:** ~5 seconds
**Expected initial bundle size (gzipped):** 120–135 KiB
