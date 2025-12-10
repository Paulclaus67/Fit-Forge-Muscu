# 🌿 Git Branches & Deployment Strategy

**Date:** December 10, 2025  
**Status:** ✅ All branches synchronized and ready

---

## 📊 Current Branch Status

```
Repository: Fit-Forge-Muscu (GitHub)
Active Branches: 3
Last Commit: e5e3b64 (Dec 10, 2025)

Branch Status:
✅ main (Protected) - e5e3b64
✅ dev (Development) - e5e3b64
✅ prod (Production) - e5e3b64
```

## 🔀 Branch Strategy

### **main** (Integration & Release Candidate)
- **Purpose:** Stable, tested code ready for production
- **Source:** Pull Requests from `dev`
- **Deploy to:** Pre-production (staging)
- **Deployment trigger:** Manual + Tests passing
- **Protection Rules:**
  - ✅ Require 1+ PR review
  - ✅ Require status checks
  - ✅ Require up-to-date branches
  - ✅ Dismiss stale PR approvals
- **When to use:** Release preparation

### **dev** (Active Development)
- **Purpose:** Integration branch for features
- **Source:** Feature branches
- **Deploy to:** Development/Staging environment
- **Deployment trigger:** Automatic on merge
- **Protection Rules:**
  - ✅ Require 1+ PR review
  - ✅ Require status checks
- **When to use:** Daily development work

### **prod** (Production - Stable)
- **Purpose:** Production-ready code only
- **Source:** Approved releases from `main`
- **Deploy to:** Production environment
- **Deployment trigger:** Manual + 2+ reviews
- **Protection Rules:**
  - ✅ Require 2+ PR reviews
  - ✅ Require status checks
  - ✅ Require conversation resolution
  - ✅ Restrict push access (admin only)
  - ✅ Include administrators
- **When to use:** Stable releases only

---

## 🔄 Workflow Diagram

```
Feature Branch (feature/*)
         ↓
    Commit & Push
         ↓
Create Pull Request → dev
         ↓
  Code Review + Tests
         ↓
    Merge to dev
         ↓
Deploy to Staging
         ↓
Integration Tests
         ↓
  Create PR: dev → main
         ↓
 Code Review + Tests
         ↓
    Merge to main
         ↓
   Tag Version (v1.0.0)
         ↓
  Deploy to Pre-prod
         ↓
   UAT & QA Tests
         ↓
  Create PR: main → prod
         ↓
  Approval x2 + Tests
         ↓
    Merge to prod
         ↓
Deploy to Production
         ↓
       ✅ Live!
```

---

## 📝 Common Git Commands

### Working with Feature Branches

```bash
# Start new feature
git checkout dev
git pull origin dev
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# Push to remote
git push -u origin feature/amazing-feature

# Create Pull Request on GitHub
# After review and merge, delete feature branch
git branch -d feature/amazing-feature
```

### Syncing Branches

```bash
# Update current branch from remote
git pull origin <branch-name>

# Fetch all remote changes
git fetch origin

# List all branches
git branch -a
```

### Creating Releases

```bash
# Release from dev to main
git checkout main
git pull origin main
git merge --no-ff dev -m "Merge dev into main for v1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Promote to production
git checkout prod
git pull origin prod
git merge --no-ff main -m "Merge main into prod for v1.0.0"
git push origin prod
```

### Hotfixes (Critical Bugs)

```bash
# Hotfix from prod
git checkout prod
git pull origin prod
git checkout -b hotfix/critical-bug

# Fix the bug
git commit -m "fix: critical bug"
git push -u origin hotfix/critical-bug

# Create PR: hotfix → prod
# After approval, merge and also merge into dev/main
git checkout main
git merge hotfix/critical-bug
git push origin main
```

---

## 🚀 Deployment Environments

| Environment | Branch | Trigger | Frequency | Status |
|-------------|--------|---------|-----------|--------|
| Development | dev | Auto on merge | Continuous | 🟡 Unstable |
| Staging | main | Manual + tests | Daily | 🟢 Stable |
| Production | prod | Manual + 2 reviews | Weekly/On-demand | 🟢🟢 Very Stable |

---

## 📊 Recent Commits (All Branches)

```
e5e3b64 - docs: Add Git workflow documentation for dev/prod branches
6a9df4d - feat: Lighthouse performance optimization + planning UI improvements
e41c590 - CI: bump to Node 22.12.0 for Prisma engines
9f20ccc - CI: force Node 20.19.0 and verify versions
cdfaaee - CI: pin Node 20.19.x for Prisma
```

---

## 🎯 What's New This Session

### ✅ Pushed to GitHub
- Lighthouse performance optimizations
- UI improvements to planning page
- Code splitting and minification
- Client-side image compression

### ✅ Created Branches
- **dev** - Development branch tracking `origin/dev`
- **prod** - Production branch tracking `origin/prod`
- **main** - Already existed, now protected

### ✅ Documentation
- Added `GIT_WORKFLOW.md` - Detailed branch strategy
- Synced documentation across all branches

---

## 🔗 GitHub Links

- **Fit-Forge-Muscu:** https://github.com/Paulclaus67/Fit-Forge-Muscu
- **Main Branch:** https://github.com/Paulclaus67/Fit-Forge-Muscu/tree/main
- **Dev Branch:** https://github.com/Paulclaus67/Fit-Forge-Muscu/tree/dev
- **Prod Branch:** https://github.com/Paulclaus67/Fit-Forge-Muscu/tree/prod
- **Commits:** https://github.com/Paulclaus67/Fit-Forge-Muscu/commits

---

## ⚠️ Important Rules

1. **Never commit directly to main or prod**
   - Always use Pull Requests
   - Always get code review

2. **Always pull before starting work**
   ```bash
   git checkout dev
   git pull origin dev
   ```

3. **Use descriptive commit messages**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `chore:` - Build, dependencies
   - `style:` - Formatting
   - `test:` - Tests

4. **Create feature branches from dev**
   ```bash
   git checkout dev
   git checkout -b feature/name
   ```

5. **Delete feature branches after merge**
   ```bash
   git branch -d feature/name
   git push origin --delete feature/name
   ```

---

## 📋 Deployment Checklist

### Before Deploying to Staging (main)
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Performance tested

### Before Deploying to Production (prod)
- [ ] Staging tests completed
- [ ] UAT approved
- [ ] Release notes prepared
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] 2+ approvals

---

## 🆘 Troubleshooting

### Accidentally committed to wrong branch?
```bash
git reset HEAD~1
git stash
git checkout correct-branch
git stash pop
git commit
```

### Need to revert a merge?
```bash
git revert -m 1 <merge-commit-hash>
```

### Merge conflicts?
```bash
git pull origin <branch>
# Resolve conflicts in editor
git add .
git commit
git push
```

---

**Last Updated:** December 10, 2025  
**Created by:** Development Team  
**Status:** ✅ Ready for use
