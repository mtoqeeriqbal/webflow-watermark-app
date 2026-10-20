# Lesson 5 — Logo opacity (saved for LATER — not in engine v1)

**Decision:** version 1 of the app keeps the logo at 100% opacity. This lesson is kept as a reference for when we add an opacity slider.

**Concepts:** pixels & RGBA, the alpha channel, 0–1 vs 0–255, blend modes, `Buffer.from([...])`, composite twice.

## What an image really is
A grid of pixels; each pixel = 4 numbers (0–255):
| R | G | B | A (alpha) |
|---|---|---|---|
| red | green | blue | 255 = solid, 128 = half, 0 = invisible |

CSS `rgba(67,83,255,0.5)` — same idea, but alpha is 0–1 there.

## sharp has no `opacity` option for an image layer → use a mask trick
Build **one pixel** with the alpha we want, tile it over the logo, and use blend mode **`dest-in`**:
> keep the logo's colors, but multiply its alpha by the mask's alpha.

| Logo pixel alpha | × mask (128/255 ≈ 0.5) | Result |
|---|---|---|
| 255 (solid) | × 0.5 | 128 (half visible) |
| 0 (transparent corner) | × 0.5 | 0 (stays invisible) |

## Code (replace the "resize" step of Lesson 4)
```js
const opacity = 0.5; // 0 = invisible, 1 = solid

// 3a. Resize the logo
const resizedLogo = await sharp(logoPath)
  .resize({ width: logoWidth })
  .ensureAlpha()
  .toBuffer();

// 3b. Make it semi-transparent
const alpha = Math.round(255 * opacity);
const opacityPixel = Buffer.from([255, 255, 255, alpha]);

const logoBuffer = await sharp(resizedLogo)
  .composite([
    {
      input: opacityPixel,
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: "dest-in",
    },
  ])
  .toBuffer();
```

| Code | Meaning |
|---|---|
| `.ensureAlpha()` | Adds an alpha channel if missing (e.g. a JPG logo). |
| `Math.round(255 * opacity)` | 0–1 → 0–255 (0.5 → 128). |
| `Buffer.from([255,255,255,alpha])` | One pixel from 4 numbers. `( )` calls the function, `[ ]` is the array it receives. |
| `raw: {width:1,height:1,channels:4}` | "These bytes aren't a PNG file; they're raw pixels, 1×1, 4 numbers each." |
| `tile: true` | Repeat the pixel over the whole logo (like a CSS background pattern). |
| `blend: "dest-in"` | Mask: keep the base, but only as visible as the top layer. |

## Why composite TWICE?
| Composite | Base | Layer | Blend | Job |
|---|---|---|---|---|
| #1 | the **logo** | 1 tiled pixel | `dest-in` | **Mask** → faded logo (like layer opacity in Photoshop) |
| #2 | the **photo** | faded logo | default `over` | **Place** it |

If we put the mask in the photo's composite, the whole **photo** would fade, because `blend` affects everything underneath.
Rule: *to change one layer by itself, process it on its own first, then place it.*

## `composite` in one sentence
Stack layers on a base image. `input` = what, `top`/`left` = where, `blend` = how to mix. It only records the instruction; `toFile`/`toBuffer` does the work (that's why they need `await`).

## Hex aside
`Buffer.from([255,255,255,128])` prints `<Buffer ff ff ff 80>` — hex (base 16), same as CSS `#ffffff`.

## Check yourself
1. What are the 4 numbers in a pixel?
2. Why convert opacity from 0–1 to 0–255?
3. Why do transparent corners stay transparent?
4. Why two composites?
