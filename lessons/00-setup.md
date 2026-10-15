# Lesson 0 — Setup

## What you did
| Command | Meaning |
|---|---|
| `node -v` | Shows Node's version. **Node** = runs JavaScript outside the browser. |
| `npm -v` | Shows npm's version. **npm** = installs *packages* (code other people wrote). |
| `mkdir ~/webflow-watermark` | *make directory* — creates the project folder. `~` = your home folder. |
| `cd ~/webflow-watermark` | *change directory* — Terminal now works inside this folder. |
| `npm init -y` | Creates `package.json`. `-y` = accept all defaults. |
| `code .` | Opens the current folder (`.`) in VS Code. |

## package.json = the project's ID card
- `name`, `version`, `description` — info about the project.
- `scripts` — shortcuts you can run with `npm run <name>`.
- `type` — which module style Node uses (`commonjs` = old `require()`, `module` = modern `import`). We switch to `module` in Lesson 1.
- `dependencies` (appears later) — the packages your project uses.

## Words to remember
- **Runtime**: the program that runs your code (browser or Node).
- **Package**: reusable code you download with npm.
- **Terminal / shell**: where you type commands.
