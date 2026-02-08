# Git Commands - Push to Main Branch

## Current Situation
You have code locally on the `main` branch and need to push it to GitHub.

---

## Simple Push Commands

### Step 1: Check your current status
```bash
git status
```

### Step 2: Add all changes
```bash
git add .
```

### Step 3: Commit your changes
```bash
git commit -m "Initial commit with full app"
```

### Step 4: Pull remote changes first (to merge)
```bash
git pull origin main --allow-unrelated-histories
```

### Step 5: Push to main branch
```bash
git push -u origin main
```

---

## If You Get Conflicts

If Step 4 shows merge conflicts:

```bash
# Accept all your local changes
git checkout --ours .
git add .
git commit -m "Merge remote changes"

# Then push
git push -u origin main
```

---

## Alternative: Force Push (Use with Caution!)

⚠️ **Warning**: This will overwrite everything on GitHub with your local code.

```bash
git push -u origin main --force
```

---

## Quick Reference - Daily Workflow

### Making changes and pushing:
```bash
# 1. Check what changed
git status

# 2. Add all changes
git add .

# 3. Commit with message
git commit -m "Your commit message here"

# 4. Push to GitHub
git push origin main
```

### Pull latest changes from GitHub:
```bash
git pull origin main
```

### Create a new branch:
```bash
git checkout -b feature-name
```

### Switch branches:
```bash
git checkout main
git checkout feature-name
```

---

## Troubleshooting

### Problem: "Updates were rejected"
```bash
# Solution: Pull first, then push
git pull origin main
git push origin main
```

### Problem: "Merge conflicts"
```bash
# Solution 1: Accept your changes
git checkout --ours .
git add .
git commit -m "Resolved conflicts"
git push origin main

# Solution 2: Accept remote changes
git checkout --theirs .
git add .
git commit -m "Resolved conflicts"
git push origin main
```

### Problem: "fatal: not a git repository"
```bash
# Solution: Initialize git
git init
git remote add origin https://github.com/yourusername/yourrepo.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## Your Specific Case

Based on your current situation, run these commands in order:

```bash
# 1. Pull and merge remote changes
git pull origin main --allow-unrelated-histories

# 2. If there are conflicts, accept your local version
git checkout --ours .
git add .
git commit -m "Merge and keep local changes"

# 3. Push to GitHub
git push -u origin main
```

---

## Verify Success

After pushing, check:
1. Go to https://github.com/riddhimachat18/PinkNest
2. You should see all your files on the main branch
3. The commit message should match what you entered

---

## Common Git Commands Cheat Sheet

```bash
# View commit history
git log --oneline

# View remote repositories
git remote -v

# View all branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View changes before committing
git diff

# View staged changes
git diff --staged

# Unstage files
git reset HEAD filename

# Discard local changes
git checkout -- filename
```

---

## Best Practices

1. **Always pull before push**: `git pull origin main` before `git push origin main`
2. **Commit often**: Small, frequent commits are better than large ones
3. **Write clear commit messages**: Describe what changed and why
4. **Use branches**: Create feature branches for new work
5. **Don't commit sensitive data**: Add `.env` files to `.gitignore`

---

## .gitignore Reminder

Make sure these are in your `.gitignore`:

```
# Dependencies
node_modules/
backend/node_modules/

# Environment variables
.env
backend/.env

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## Need Help?

If you're stuck, you can always:
1. Check status: `git status`
2. View what changed: `git diff`
3. See commit history: `git log --oneline`
4. Ask for help with the specific error message
