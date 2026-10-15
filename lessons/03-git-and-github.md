# Lesson 3 — Git & GitHub (move your project to another laptop)

**Concepts:** version control, repository, commit, `.gitignore`, remote, push, clone, why `node_modules` is never uploaded.

## Words
- **Git** — a program on your computer that saves *snapshots* (commits) of your project.
- **Repository (repo)** — a project folder tracked by Git (it has a hidden `.git` folder).
- **Commit** — one saved snapshot + a message describing what changed.
- **GitHub** — a website that stores a copy of your repo online (a **remote**).
- **Push** — upload your commits to GitHub. **Clone** — download a repo. **Pull** — download new commits.

## On this Mac
```bash
cd ~/webflow-watermark
git init                       # turn the folder into a repo (creates .git)
```
Create a file named `.gitignore` (starts with a dot) containing:
```
node_modules/
output*.png
.env
.DS_Store
```
- `node_modules/` — huge, and rebuilt by `npm install`. sharp also downloads a *different* version per computer type, so never share it.
- `output*.png` — generated files; they can be re-created by running the script.
- `.env` — secrets (Client Secret later). **Never** on GitHub.
- `.DS_Store` — junk files macOS creates.

```bash
git status                     # what Git sees (node_modules should NOT be listed)
git add .                      # stage all files for the next snapshot
git commit -m "Lesson 1-2: first watermark script"
```
Create an empty repo on github.com → **New repository** → name `webflow-watermark`, **Private**, *don't* tick README/.gitignore. Then:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/webflow-watermark.git
git push -u origin main
```
- `branch -M main` — name the main branch `main`.
- `remote add origin <url>` — "origin" is a nickname for the GitHub copy.
- `push -u origin main` — upload; `-u` remembers it so next time just `git push`.

## On the other laptop
```bash
git clone https://github.com/<your-username>/webflow-watermark.git
cd webflow-watermark
npm install                    # reads package.json, rebuilds node_modules for THAT computer
node watermark.js
```

## Daily loop
```bash
git add .
git commit -m "what I changed"
git push        # on one laptop
git pull        # on the other, before you start working
```
