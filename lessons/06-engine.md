# Lesson 6 — The watermark engine (settings object, no opacity in v1)

**Goal:** one reusable function `addWatermark(image, settings)` — the core of the Webflow app.
**Concepts:** `export`/`import` between own files, default parameters, spread `...`, lookup objects, `return`, ternary `? :`, `===`, destructuring with renaming, private vs exported functions.

## Why
Before: two scripts with everything hard-coded. In the finished app the **user** picks options in a panel; every control becomes one key in a `settings` object. The function is the **machine**, `settings` are the **knobs**.

Settings for v1: `{ type, text, logoPath, position, size }` (opacity comes later).

## File: `watermark-engine.js`
```js
import sharp from "sharp";

export const defaults = {
  type: "text",
  text: "© Watermark",
  logoPath: "logo.png",
  position: "bottom-right",
  size: 0.2,
};

export function mergeSettings(userSettings = {}) {
  return { ...defaults, ...userSettings };
}

export function getPosition(position, imgW, imgH, layerW, layerH, padding) {
  const positions = {
    "top-left":     { left: padding, top: padding },
    "top-right":    { left: imgW - layerW - padding, top: padding },
    "bottom-left":  { left: padding, top: imgH - layerH - padding },
    "bottom-right": { left: imgW - layerW - padding, top: imgH - layerH - padding },
    "center":       { left: Math.round((imgW - layerW) / 2), top: Math.round((imgH - layerH) / 2) },
  };

  return positions[position] || positions["bottom-right"];
}

async function makeLogoLayer(logoPath, targetWidth) {
  return sharp(logoPath)
    .resize({ width: targetWidth })
    .png()
    .toBuffer();
}

async function makeTextLayer(text, targetWidth) {
  const fontSize = Math.round(targetWidth / (text.length * 0.6));
  const layerHeight = Math.round(fontSize * 1.4);

  const svg = `
<svg width="${targetWidth}" height="${layerHeight}" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="${fontSize}" font-size="${fontSize}"
    font-family="Arial, sans-serif" fill="white">${text}</text>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function addWatermark(input, userSettings = {}) {
  const settings = mergeSettings(userSettings);

  const image = sharp(input);
  const { width, height } = await image.metadata();

  const targetWidth = Math.round(width * settings.size);
  const padding = Math.round(width / 40);

  const layer =
    settings.type === "logo"
      ? await makeLogoLayer(settings.logoPath, targetWidth)
      : await makeTextLayer(settings.text, targetWidth);

  const { width: layerW, height: layerH } = await sharp(layer).metadata();
  const { left, top } = getPosition(
    settings.position, width, height, layerW, layerH, padding
  );

  return image.composite([{ input: layer, left, top }]).png().toBuffer();
}
```

## Test file: `test.js`
```js
import fs from "node:fs/promises";
import { addWatermark } from "./watermark-engine.js";

const photo = await fs.readFile("input.png");

const textResult = await addWatermark(photo, {
  type: "text", text: "© Toqeer", position: "top-left", size: 0.15,
});
await fs.writeFile("output-test-text.png", textResult);

const logoResult = await addWatermark(photo, {
  type: "logo", position: "center", size: 0.3,
});
await fs.writeFile("output-test-logo.png", logoResult);

console.log("Done");
```
Run: `node test.js`

## Concepts
| Code | Meaning |
|---|---|
| `export` | Makes a variable/function usable from other files. No `export` = private to this file. |
| `userSettings = {}` | **Default parameter** — used when nothing is passed. |
| `{ ...defaults, ...userSettings }` | **Spread**: copy defaults, then user values overwrite matching keys. **Order matters** — reversed, the defaults would win. |
| `return` | Sends a result **out** of a function (without it you get `undefined`). |
| `positions[position] \|\| ...` | **Lookup object** instead of an if/else chain; `\|\|` = fallback if the key isn't found. |
| `cond ? a : b` | **Ternary**: pick one of two values. Logo layer if type is `"logo"`, else text layer. |
| `===` | Strict equality (value AND type). |
| `{ width: layerW, height: layerH }` | Destructuring with **renaming** (`width` is already the photo's). |
| `sharp(input)` | `input` can be a file path **or a Buffer** (the app will pass Buffers downloaded from Webflow). |
| `return ...toBuffer()` | The function returns bytes; the **caller** decides to save/upload. |
| `size: 0.2` | Watermark width = 20% of photo width, same meaning for text and logo. |

## Notes
- Text width is an **estimate** (`0.6 × fontSize` per character) so text positions are approximate; logos are exact.
- Special characters in text (`&`, `<`) would break the SVG — escape them later.
- Output files start with `output` so `.gitignore` excludes them.

## Check yourself
1. What does `{ ...defaults, ...userSettings }` do, and why does the order matter?
2. What does the ternary replace?
3. What does `addWatermark` return, and why not save a file inside it?
4. Why aren't `makeLogoLayer` / `makeTextLayer` exported?
