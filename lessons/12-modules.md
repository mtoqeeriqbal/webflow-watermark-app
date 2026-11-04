# Lesson 12 — Split the preview into modules

**Goal:** turn one 146-line `app.js` into small files that each do one job, using `import` / `export` in the browser.

## 1. Why
One big file mixes setup, data, drawing and events, so it is hard to find things. Small files have one job each, and the panel in the Webflow Designer will need several files anyway.

## 2. The files
| File | Job | Imports | Exports |
|---|---|---|---|
| `position.js` | `getPosition` | nothing | `getPosition` |
| `elements.js` | finds the page elements | nothing | 9 elements + `ctx` |
| `state.js` | the data | nothing | `state`, `settings` |
| `draw.js` | paints the canvas | position, elements, state | `draw` (+ `drawText`, `drawLogo`) |
| `events.js` | listeners | elements, state, draw | nothing |
| `app.js` | entry point | `events.js` | nothing |

```
position ─┐
elements ─┼─► draw ─► events ─► app
state ────┘      └──────────────▲
```
Arrows go one way only. If `draw.js` also imported `events.js`, that would be a circular import, which causes confusing bugs.

## 3. Browser modules vs plain scripts
| | `<script>` | `<script type="module">` |
|---|---|---|
| `import` / `export` | not allowed | allowed |
| Top-level variables | global (`settings` works in the Console) | private to the file |
| Opened by double-click | works | **fails**: the page must be served (VS Code Live Server, `http://127.0.0.1:5500`) |

- Paths need `./` and the `.js` ending: `import { draw } from "./draw.js"`.
- Names in `{ }` must match the exports exactly (capital letters count).
- A file without `export` on a function keeps it private.
- `import "./events.js";` (no braces) just loads and runs the file.

## 4. The read-only rule
An imported variable cannot be reassigned from another file:
```js
currentImage = img;     // would fail after importing it
state.image = img;      // works: changing a property of an object is allowed
```
So `let currentImage` / `let currentLogo` became one object:
```js
export const state = { image: null, logo: null };
```
`state` holds loaded images. `settings` stays plain data (strings and numbers) only.

## 5. Reading a chain of dots
`state.logo.naturalHeight` = the object → the logo image → its real height (740). It breaks with "Cannot read properties of null" if a piece in the middle is `null`, so guards (`if (!state.logo) return;`) come first.

## 6. Mistakes and lessons learned
- Files made without `export` / `import` failed **quietly**: `app.js` never loaded `events.js`, so no listeners were attached and the page looked dead, with no red error. A quiet failure means check what loads what.
- One leftover `currentLogo` in `draw.js` would have caused `ReferenceError: currentLogo is not defined` on first use of the Logo radio. After renaming, search the file for the old name (`grep` / Find).
- Copy then delete: the nine element lines stayed in `app.js` after being copied. Each thing should live in one place.

## 7. Experiments
1. Open the page by double-click and read the error in the Console.
2. Type `settings` in the Console. Why does it say "not defined"?
3. Remove `export` from `getPosition` and read the error.
4. Rename `draw` to `render` in `draw.js` only. What does the error say, and where?
5. Add `console.log("events loaded")` at the top of `events.js` and `console.log("draw loaded")` at the top of `draw.js`. Which prints first, and why?
6. In `events.js`, try `state = {}` and read the error.

## 8. Check yourself (answer in your own words)
1. Why did `currentImage` become `state.image`?
2. What does `import "./events.js";` do without braces?
3. Why is `canvas` imported in `draw.js` but not in `events.js`?
4. Why must the page be served instead of double-clicked?
5. What is a circular import, and which file in this project would create one?
6. Why do we keep `drawText` private if only `draw` is called from outside?

## 9. Status
- [x] position.js, elements.js, state.js, draw.js, events.js, app.js
- [x] `<script type="module" src="app.js">` in index.html
- [ ] Next: share `getPosition` between the engine and the preview (one file, two users)
- [ ] Optional: Step 6 of Lesson 11 (disable the unused control)
