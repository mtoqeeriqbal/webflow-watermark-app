# Study Guide — Day 1 (Lessons 0–9)

Goal of this guide: turn "I followed along" into "I can do it myself".
Method: read a section → close the file → explain it out loud or write it in your own words → check.

---

## 1. The big picture

You built two halves of the same idea:

```
NODE (your Mac)                          BROWSER (preview page)
watermark-engine.js                      preview/app.js
  addWatermark(photo, settings)            draw() reads `settings`
    → returns a finished image               → paints photo + watermark on a canvas

            both use the SAME settings idea:
            { type, text, position, size }
```

Later, the Webflow panel (browser) will collect `settings`, and a server (Node) will run `addWatermark` with them.
**Everything you learned today is a part of that machine.**

---

## 2. Concept map (what, why, where you used it)

### A. Tools
| Concept | One-line meaning | Where |
|---|---|---|
| Node | Runs JS outside the browser | `node watermark.js` |
| npm / package | Installs code others wrote | `npm install sharp` |
| `package.json` | The project's ID card (name, scripts, dependencies, `"type"`) | L0–1 |
| `node_modules` | Downloaded packages; never commit it | L3 |
| Git / commit / push | Snapshots + online copy | L3 |
| `.gitignore` | Files Git must never upload (`node_modules`, `.env`, `output*.png`) | L3 |

### B. JavaScript language
| Concept | Example | Remember |
|---|---|---|
| `const` / `let` | `const width = 5;` `let layer;` | `const` can't be reassigned; use it by default |
| String / template string | `` `Size: ${width}` `` | Backticks allow `${}` slots and multiple lines |
| Number math | `Math.round(width / 20)` | `Math` is built in |
| Function | `function f(a, b) { return a + b; }` | Parameters in, `return` out |
| Arrow function | `() => { ... }` | A function without a name, used in listeners |
| Default parameter | `function f(opts = {})` | Used when nothing is passed |
| Object | `{ left: 1, top: 2 }` | `key: value` pairs; read with `obj.key` or `obj["key"]` |
| Array | `[255, 255, 255, 128]` | An ordered list; `files[0]` is the first item |
| Destructuring | `const { width, height } = info;` | Pull keys out of an object into variables |
| Destructuring + rename | `const { width: layerW } = info;` | Use when the name is already taken |
| Shorthand | `{ top, left }` = `{ top: top, left: left }` | Same key and variable name |
| Spread | `{ ...defaults, ...user }` | Copy, later values win → **order matters** |
| Lookup object | `positions[position]` | Replaces long if/else chains |
| `\|\|` | `a \|\| b` | "a, or b if a is empty/missing" (fallback) |
| Ternary | `cond ? a : b` | Pick one of two values |
| `===` | `type === "logo"` | Strict equality (value + type) |
| Guard clause | `if (!file) return;` | Exit early when there's nothing to do |
| `Number()` | `Number("20")` → `20` | `.value` is always a string |
| `NaN` | `1558 * element` | "Not a Number" → a bug upstream |
| `export` / `import` | `export function f` / `import { f } from "./x.js"` | No `export` = private to the file |

### C. Async (the hardest idea today)
- Slow things (reading files, saving, network) return a **Promise** = "I'll give you the answer later".
- `await` = pause **this function** until the answer arrives.
- `await` only works inside an `async function` (or at the top level of a module file like `test.js`).
- Forgetting `await` gives you a Promise object instead of the result.
- Browser version of the same idea: `img.onload` = "run this when loading finishes" (a callback).

### D. Images
| Concept | Meaning |
|---|---|
| Pixel | 4 numbers 0–255: R, G, B, A (alpha = visibility) |
| Buffer | Raw bytes. sharp reads bytes; a string path means "go find this file" |
| `sharp(x)` | `x` can be a path or a Buffer |
| `.metadata()` | Read width/height/format |
| `.resize({ width })` | Height follows automatically |
| `.composite([{ input, top, left }])` | Stack layers on a base. `input` = what, `top/left` = where, `blend` = how |
| `.toBuffer()` vs `.toFile()` | Bytes in memory vs a file on disk |
| `blend: "dest-in"` | Mask: keeps the base, multiplies its alpha (Lesson 5, saved for later) |
| `composite` is lazy | Nothing happens until `toFile` / `toBuffer` |

### E. Coordinates & layout (used in SVG, sharp and canvas)
```
(0,0) ─────────────► x
  │
  │        left, top = the layer's TOP-LEFT corner
  ▼ y
```
- y grows **downward** (same as CSS `top`).
- Bottom-right: `left = imgW − layerW − padding`, `top = imgH − layerH − padding`.
- SVG text `y` = baseline; canvas can choose with `textBaseline`.
- `text-anchor="end"` (SVG) = `textAlign = "right"` (canvas).

### F. Browser
| Concept | Meaning |
|---|---|
| DOM | The page as JS objects (`document`) |
| `getElementById` | Find an element (id is case-sensitive) |
| Event + listener | `el.addEventListener("input", fn)` = trigger + action |
| `input` vs `change` | `input` fires on every change; `change` when you finish |
| `files[0]` → `createObjectURL` → `img.src` → `onload` | The photo's journey into the canvas |
| Canvas resolution vs CSS size | `canvas.width` = real pixels; CSS only scales the look |
| `ctx.measureText` | Exact text width in the browser |
| **State → draw()** | Update `settings` (plain data), then redraw. `settings` holds values, never elements |

---

## 3. Recall questions (answer WITHOUT looking; answers at the bottom)

1. What's the difference between `const` and `let`?
2. What does `await` do, and where is it allowed?
3. Why do we pass `Buffer.from(svg)` instead of the string `svg` to sharp?
4. In `{ ...defaults, ...userSettings }`, what happens if you swap the two?
5. What does `composite` do? Name its three most important layer options.
6. `left = width − layerW − padding`: explain each part in words.
7. Why is `.value` converted with `Number()`?
8. What's the difference between `input` and `change` events?
9. Why does `draw()` set `canvas.width` before `drawImage`?
10. Why must `settings` hold plain values, not HTML elements? (Today's NaN bug.)
11. Why do we never commit `node_modules`?
12. What's the difference between `toBuffer()` and `toFile()`, and why does `addWatermark` return a buffer?

---

## 4. Predict the output (write your guess, then run it in Node or the browser console)

```js
console.log(Math.round(1558 / 20));            // ?
console.log(Math.round(1558 / 40));            // ?
console.log(1558 - 312 - 39);                  // ?
console.log("20" + 5);                         // ?
console.log(Number("20") + 5);                 // ?
console.log("20" / 100);                       // ?
console.log({ ...{ a: 1, b: 2 }, ...{ b: 9 } });   // ?
console.log({ ...{ b: 9 }, ...{ a: 1, b: 2 } });   // ?
console.log(5 * { });                          // ?
console.log(Buffer.from([255, 255, 255, 128]));    // ?
```

---

## 5. Practice (do these yourself; ask me only after you've tried)

**Easy**
1. Add a **`"bottom-center"`** position to `getPosition` (in both `watermark-engine.js` and `preview/app.js`) and a matching `<option>` in the dropdown.
2. Change the default text to your website, and the default size to 0.25.
3. Add `console.log(settings)` inside a listener and watch it in DevTools.

**Medium**
4. Add a **color** setting: `<input type="color" id="colorInput" value="#ffffff">` → `settings.color` → `ctx.fillStyle = settings.color`. (Hint: its `.value` is already a string like `"#ffffff"`; which event do you listen to?)
5. In Node, write `describeImage(path)` that **returns** a string like `"1558x901 png"`. Call it from `test.js` and print the result.

**Stretch**
6. Make the text watermark have a soft shadow on the canvas: look up `ctx.shadowColor` / `ctx.shadowBlur`.
7. Explain in 5 sentences, to an imaginary Webflow designer, how a photo gets from the file picker to the canvas.

**Break it on purpose (and read the error each time)**
- Remove `await` before `image.metadata()`.
- Misspell an element id in `getElementById`.
- Put `settings.size = sizeRange` (element, not value) → see `NaN`.
- Delete `export` from `getPosition` and import it.
- Set `size: 3` (watermark bigger than the photo).

---

## 6. Debugging checklist (use this every time)

1. **Read the error message** — file name + line number tell you where.
2. **Print the values:** `console.log({ a, b, c })` (the braces label them).
3. Check types: is it a **string** when you expected a **number**? an **element** when you expected a value?
4. `null` / `undefined` → a name or id doesn't match (capital letters!).
5. `NaN` → math with something that isn't a number.
6. Nothing happens → is the function **called**? is the event name right? is `await` missing?
7. Browser: DevTools → Console (errors) + `console.log`. Node: the Terminal.

---

## 7. 60-minute review plan (tomorrow morning)

| Min | Do |
|---|---|
| 0–10 | Recall questions, out loud, no notes |
| 10–20 | Predict-the-output block, then check |
| 20–40 | Practice 1, 2 and 4 |
| 40–50 | Re-read lessons 6 and 9 and compare with your own code |
| 50–60 | `git add . && git commit -m "..." && git push`, then write 5 lines: "what I understood / what is still fuzzy" and send it to me |

---

## 8. Glossary
- **Argument / parameter:** the value you pass in / the name it gets inside the function.
- **Callback:** a function you hand over to be run later (`img.onload`, event listeners).
- **State:** the data your app remembers (`settings`, `currentImage`).
- **Guard clause:** an early `return` for the "nothing to do" case.
- **Layer:** an image placed on top of a base image.
- **Alpha:** a pixel's visibility (0 invisible – 255 solid).
- **Buffer:** raw bytes.
- **Module:** a JS file that exports/imports pieces.
- **Resolution vs display size:** real pixels vs how big CSS shows it.

---

## 9. Answers

1. `const` can't be reassigned, `let` can. Use `const` by default.
2. It pauses the current function until a Promise finishes. Allowed inside `async` functions (and at the top level of ES modules).
3. A plain string is treated as a file path; a Buffer is the actual bytes of the image.
4. The defaults would overwrite the user's values — the user's choices would be ignored.
5. Stacks layers on a base image. `input` (what), `top`/`left` (where), `blend` (how). Also `tile`, `raw`.
6. Start at the right edge (`width`), move back by the layer's width, then by the padding → the layer's left edge.
7. `.value` is always a string; `Number()` makes it a real number so math (especially `+`) works.
8. `input` fires on every change (each keystroke/slider step); `change` fires when you finish/leave the field.
9. Setting `canvas.width/height` resizes **and clears** the canvas; the photo must be drawn after that.
10. Math/formulas need numbers and strings; an element gives `NaN`. Also `settings` must be sendable to a server later, and elements can't be.
11. It's huge, rebuilt by `npm install`, and some packages (like sharp) install a different build per computer.
12. `toBuffer` returns bytes in memory, `toFile` writes to disk. The engine returns a buffer so the caller decides: save, upload to Webflow, show in a preview.

Predict-the-output answers: `78`, `39`, `1207`, `"205"`, `25`, `0.2`, `{ a: 1, b: 9 }`, `{ b: 2, a: 1 }`, `NaN`, `<Buffer ff ff ff 80>`.
