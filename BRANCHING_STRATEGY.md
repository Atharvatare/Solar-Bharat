# Solar Bharat — Git Branching Strategy

## Branch Structure

```
main (production — auto-deploys to Vercel)
 ├── develop (integration branch — merge frontend + backend here first)
 │    ├── frontend (all UI/React work)
 │    └── backend (all API/Node.js work)
 └── feature/* (optional short-lived feature branches)
```

## Branch Purposes

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| `main` | Production-ready code | ✅ Vercel (auto-deploy) |
| `develop` | Integration & testing before production | — |
| `frontend` | All React/UI/CSS changes | — |
| `backend` | All Node.js/API/DB changes | — |

## Workflow (Solo Developer)

### For Frontend Changes:
```bash
git checkout frontend
# make your changes...
git add -A
git commit -m "feat(ui): description of change"
git push origin frontend

# When ready, merge to develop:
git checkout develop
git merge frontend
git push origin develop

# When tested, merge to main for deployment:
git checkout main
git merge develop
git push origin main
```

### For Backend Changes:
```bash
git checkout backend
# make your changes...
git add -A
git commit -m "feat(api): description of change"
git push origin backend

# Merge to develop, then to main (same as above)
```

### For Full-Stack Changes (both frontend + backend):
```bash
# Work on each branch separately, then merge both into develop
git checkout develop
git merge frontend
git merge backend
git push origin develop

# Test, then merge to main
git checkout main
git merge develop
git push origin main
```

## Commit Message Convention

Use prefixes for clear history:

| Prefix | Use For |
|--------|---------|
| `feat(ui):` | New frontend feature |
| `feat(api):` | New backend feature |
| `fix:` | Bug fix |
| `style:` | CSS/styling changes |
| `refactor:` | Code refactoring |
| `docs:` | Documentation |
| `chore:` | Build/tooling changes |

## Quick Reference

```bash
# See all branches
git branch -a

# Switch branch
git checkout frontend

# Create a feature branch
git checkout -b feature/new-page frontend

# Merge feature back
git checkout frontend
git merge feature/new-page
git branch -d feature/new-page
```
