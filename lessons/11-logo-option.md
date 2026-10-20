# Lesson 11 — Logo option in the preview (IN PROGRESS)

Goal: a Text/Logo switch, a logo file picker, and the logo drawn on the canvas
with the same position and size controls.

## Concept
Text and logo are both **layers**: each needs a width, a height and a left/top from `getPosition`.
Only the drawing call differs.

| | Text layer | Logo layer |
|---|---|---|
| Source | a string | an image file the user picks |
| Width | `canvas.width * size` | same |
| Height | `fontSize` | logo height × (logoW / logo natural width) |
| Canvas call | `ctx.fillText(text, left, top)` | `ctx.drawImage(img, left, top, w, h)` |

Rules kept: `settings` holds plain data only (`type` is the string "text" or "logo").
The logo `Image` object is not plain data, so it lives in its own variable, `currentLogo`.

## Numbers (input.png 1558 x 901, logo.png 4020 x 740, size 20%)
| Value | Formula | Result |
|---|---|---|
| Logo width on canvas | `canvas.width * size` | 311.6 → 312 |
| Scale factor | 312 / 4020 | ≈ 0.0776 |
| Logo height on canvas | 740 × 0.0776 | ≈ 57 |
| Padding | 1558 / 40 | ≈ 39 |
| Bottom-right left | 1558 − 312 − 39 | 1207 |
| Bottom-right top | 901 − 57 − 39 | 805 |

One scale factor for both sides keeps the logo's shape (no stretching).

## Done so far
- [x] Step 1: HTML — two radios (`name="typeRadio"`, values text/logo) and `#logoInput` file picker.
      Mistake caught: the `#textInput` label was deleted by accident → `textInput` was null → script crashed. Rule: after editing HTML, check the Console.
- [x] Step 2: `app.js` — `logoInput`, `typeRadios` (querySelectorAll), `let currentLogo = null`, `type: "text"` in `settings`.
- [x] Step 3: `logoInput` change listener → `currentLogo` (same pipeline as the photo) with a `console.log` of the logo size.

## Still to do (resume here)
- [ ] Step 4: write `drawLogo()`: guard → padding → logoW → logoH → getPosition → `ctx.drawImage(currentLogo, left, top, logoW, logoH)`.
      In `draw()`, replace `drawText()` with `if (settings.type === "logo") { drawLogo() } else { drawText() }`.
      Test by temporarily setting `type: "logo"` in `settings`. Expect a ≈312 x 57 logo at left 1207, top 805.
- [ ] Step 5: radio listeners (`typeRadios.forEach(...)`, event `change`) → `settings.type = radio.value; draw();`
- [ ] Step 6: hide/disable the unused control (text input vs logo picker) — optional.
- [ ] Step 7: engine parity check (Node `makeLogoLayer` vs canvas result).
- [ ] Experiments, check-yourself questions, finish these notes, commit.
- [ ] Optional: restore the `!Number.isFinite(settings.size)` guard in `drawText()` (it was in the earlier pasted copy, not in the repo).

## Debug tip
Print values with a label: `console.log({ logoW, logoH, left, top })`.
