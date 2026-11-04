# Lesson 11 — Logo option in the preview

**Goal:** a Text/Logo switch, a logo file picker, and the logo drawn on the canvas with the same position and size controls. Then tidy `app.js` into sections.

## 1. Concept: one question, two answers
Text and logo are both **layers**. A layer needs a width, a height, and a left/top from `getPosition`. Only the drawing call differs.

| | Text layer | Logo layer |
|---|---|---|
| Source | a string | an image file the user picks |
| Width | `canvas.width * size` | same |
| Height | `fontSize` | logo height × (logoW / logo natural width) |
| Canvas call | `ctx.fillText(text, left, top)` | `ctx.drawImage(img, left, top, w, h)` |

Rules kept:
- `settings` holds plain data only. `type` is the string `"text"` or `"logo"`.
- The logo `Image` object is not plain data, so it lives in `currentLogo`.
- Listeners update state, then call `draw()`. `draw()` reads state.

## 2. Numbers (input.png 1558 x 901, logo.png 4020 x 740, size 20%)
| Value | Formula | Result |
|---|---|---|
| Logo width on canvas | `canvas.width * size` | 311.6 → 312 |
| Scale factor | 312 / 4020 | ≈ 0.0776 |
| Logo height on canvas | 740 × 0.0776 | ≈ 57 |
| Padding | 1558 / 40 | ≈ 39 |
| Bottom-right left | 1558 − 312 − 39 | 1207 |
| Bottom-right top | 901 − 57 − 39 | 805 |

One scale factor for both sides keeps the logo's shape (no stretching).

## 3. The logo pipeline (same as the photo)
file picker → `files[0]` → `URL.createObjectURL` → `new Image()` → `img.onload` → `img.src = url`

- `createObjectURL` makes a temporary address (`blob:http://127.0.0.1:5500/...`) that points at the file in the browser's memory. Nothing is uploaded or copied.
- Setting `img.src` starts loading. `onload` runs later, after the browser has decoded the PNG into pixels (4020 × 740 × 4 bytes ≈ 11.9 MB in memory, from a 134 KB file).
- Run order: the callback finishes first; `onload` runs after the image has loaded.
- `revokeObjectURL` frees the address. The decoded image keeps working.
- `currentLogo = img;` has no `const`/`let` on purpose: it updates the outer variable.

## 4. The three pieces of code
```js
function drawLogo() {
  if (!currentLogo) return;
  const logoW = Math.round(canvas.width * settings.size);
  const logoH = Math.round(currentLogo.naturalHeight * (logoW / currentLogo.naturalWidth));
  const padding = Math.round(canvas.width / 40);
  const { left, top } = getPosition(
    settings.position, canvas.width, canvas.height, logoW, logoH, padding
  );
  ctx.drawImage(currentLogo, left, top, logoW, logoH);
}
```
```js
// in draw()
if (settings.type === "logo") { drawLogo(); } else { drawText(); }
```
```js
typeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    settings.type = radio.value;
    draw();
  });
});
```
- `querySelectorAll` returns a list, so we loop with `forEach` and attach one listener per radio.
- Radios with the same `name` form one group. Each `value` is the string copied into `settings.type`.
- The `settings` block in the file is only the **starting values**. Listeners change the object in memory while the page runs; they never rewrite the file. `const` stops reassigning the variable, not changing its properties.

## 5. Refactor: organise `app.js` (Option A)
Same behaviour, clearer structure. Fixed order in the file:

```
1. ELEMENTS → 2. STATE → 3. HELPERS → 4. DRAWING → 5. EVENTS
```
- Moves made: bring `drawLogo()` beside `drawText()`; add section banners; reorder so the numbers run 1–5; fix indentation; remove debug logs.
- Functions can sit anywhere because they run later. `const`/`let` must exist before code that runs immediately uses them.
- Refactoring = change the structure, never the behaviour. Test after every move.
- **Next idea (Lesson 12):** split into modules (`position.js`, `draw.js`, `events.js`) and share `getPosition` with the engine. Needs a served page (Live Server) and `<script type="module">`.

## 6. Mistakes and lessons learned
- Deleting the `#textInput` label in the HTML made `textInput` `null`, so the script crashed at `textInput.addEventListener`. After editing HTML, check the Console.
- Git said "Please clean your repository working tree before checkout": uncommitted edits block a pull. Fix with `git restore <file>` (discard), commit, or stash.
- Check that the code you worked on is saved and committed before closing a session.

## 7. Experiments
1. Set the size slider to 5% and to 50% with the logo. Predict `logoW` and `logoH` first.
2. Use a square logo (or make one). What happens to `logoH`?
3. Click the Logo radio **before** picking a logo. What do you see, and which line causes it?
4. Position `center` with a 50% logo. Calculate `left` and `top` by hand, then compare.
5. Break it on purpose: remove `if (!currentLogo) return;`, click Logo with no logo picked, and read the error.
6. Add `console.log(settings)` inside the radio listener and watch `type` change.

## 8. Check yourself (answer in your own words)
1. Why does the radio code use `forEach`?
2. Why is `currentLogo` not inside `settings`?
3. Why does `onload` run after the lines that come below it?
4. What does `URL.createObjectURL` return, and where does the data live?
5. A logo is 2000 × 500. The canvas is 1000 wide and size is 30%. What are `logoW` and `logoH`?
6. Why must the `if (!currentLogo) return;` guard come first in `drawLogo()`?
7. Why can the position of a function in the file change without breaking the page, but not a `const`?

## 9. Status
- [x] Steps 1–5: HTML controls, element and state variables, logo loading, `drawLogo()`, radio switch
- [x] Refactor: sections and clean-up
- [ ] Step 6 (optional, later): disable the unused control (text box / logo picker)
- [ ] Step 7 (optional, later): compare the Node logo result with the canvas result
- [ ] Optional: restore the `!Number.isFinite(settings.size)` guard in `drawText()`
