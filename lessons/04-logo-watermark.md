# Lesson 4 — Logo watermark

**Goal:** put a logo in the bottom-right corner, sized relative to the photo.
**Concepts:** comments (`//`), `resize`, `toBuffer`, reading a second image's size, calculating a position, object shorthand `{ top, left }`.

## How it differs from text (Lesson 2)
- Lesson 2: the SVG layer was **the same size as the photo** → placed at `top: 0, left: 0`, text positioned *inside* with `x`/`y`.
- Lesson 4: the layer is **small** (just the logo) → we calculate where its **top-left corner** goes.

```
(0,0) ───────────────────────────► 1558
  │              left = 1207
  │                  ▼
  │       top = 737 ►┌─────────┐
  │                  │  LOGO   │ 125
  │                  └─────────┘
  ▼ 901                 312        (39px gap right + bottom)
```

## Code (`logo-watermark.js`)
```js
import sharp from "sharp";

const inputPath = "input.png";
const logoPath = "logo.png";
const outputPath = "output-logo.png";

async function addLogoWatermark() {
  // 1. Read the photo size
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  // 2. Decide how big the logo should be
  const logoWidth = Math.round(width / 5);
  const padding = Math.round(width / 40);

  // 3. Resize the logo
  const logoBuffer = await sharp(logoPath)
    .resize({ width: logoWidth })
    .toBuffer();

  // 4. Find the resized logo's height
  const logoInfo = await sharp(logoBuffer).metadata();
  const logoHeight = logoInfo.height;

  // 5. Calculate the position (bottom-right)
  const left = width - logoWidth - padding;
  const top = height - logoHeight - padding;

  // 6. Place the logo and save
  await image
    .composite([{ input: logoBuffer, top, left }])
    .toFile(outputPath);

  console.log(`Saved ${outputPath}: logo ${logoWidth}x${logoHeight} at left ${left}, top ${top}`);
}

addLogoWatermark();
```

## Line by line
| Code | Meaning |
|---|---|
| `// ...` | Comment: ignored by JS, notes for humans. |
| `Math.round(width / 5)` | Logo = 1/5 of photo width (1558/5 = 311.6 → 312). |
| `sharp(logoPath)` | A **second** sharp object, for the logo. |
| `.resize({ width })` | Only width given → height is calculated automatically (no stretching). |
| `.toBuffer()` | Result as **bytes in memory** instead of a file (`toFile`). |
| `sharp(logoBuffer).metadata()` | We know the new width, but sharp computed the height — read it back. |
| `left = width - logoWidth - padding` | Start at the right edge, go back by logo width, then by padding. |
| `{ top, left }` | **Shorthand** for `{ top: top, left: left }`. |

Numbers for the 1558 × 901 photo: `left = 1558 − 312 − 39 = 1207`, `top = 901 − 125 − 39 = 737`.

## Bug I hit (good lesson)
I changed `padding` to `width / 3` instead of the logo width → the logo was small and floated near the **middle**, 519px from the corner.
**Lesson:** code does exactly what you tell it. Print the values (`left`, `top`) with `console.log` to see what's really happening. To make the logo bigger, change `logoWidth`, not `padding`.

## Check yourself
1. Why `.toBuffer()` instead of `.toFile()` here?
2. Why read the logo's metadata **after** resizing?
3. In Lesson 2 we used `top: 0, left: 0`. Why isn't it 0 here?
4. What does `{ top, left }` mean?
