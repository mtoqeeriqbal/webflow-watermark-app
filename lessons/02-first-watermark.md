# Lesson 2 — Your first watermark

**Goal:** draw "© Toqeer" in the bottom-right corner and save a new image.
**Concepts:** `Math` helpers, template strings for multi-line text, SVG as a "drawing", `Buffer`, arrays of objects, method chaining.

---

## The idea (how watermarking works)
1. Read the photo's **width** and **height** (you did this in Lesson 1).
2. Make a transparent **drawing** (SVG) of exactly the same size, with text in the corner.
3. **Composite** = lay the drawing on top of the photo, like a sticker.
4. Save the result as a **new** file. The original is never changed.

## The code — replace everything in `watermark.js`

```js
import sharp from "sharp";

const inputPath = "input.png";
const outputPath = "output.png";
const watermarkText = "© Toqeer";
```
- Three settings at the top. Putting settings in variables = change them in one place later.

```js
async function addWatermark() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
```
- Same as Lesson 1, but we destructure directly from the `await` result — no `info` variable needed.

```js
  const fontSize = Math.round(width / 20);
  const padding = Math.round(width / 40);
```
- `Math` is a built-in object with math helpers. `Math.round(4.6)` → `5`.
- Size is **relative** to the image: text is 1/20 of the width. A tiny image gets small text, a huge one gets big text. Hard-coding `fontSize = 40` would look wrong on different images.

```js
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${width - padding}"
    y="${height - padding}"
    font-size="${fontSize}"
    font-family="Arial, sans-serif"
    fill="white"
    fill-opacity="0.6"
    text-anchor="end"
  >${watermarkText}</text>
</svg>`;
```
- Backtick strings can span **many lines** — perfect for building SVG/HTML.
- **SVG** = a picture described with text (you know it from Webflow icons!).
- `x`, `y` = where the text sits. `width - padding` = near the right edge.
- `text-anchor="end"` = the text's **right edge** sits at `x`, so it grows leftwards and never runs off the image.
- `fill-opacity="0.6"` = 60% visible.

```js
  const svgBuffer = Buffer.from(svg);
```
- sharp works with raw **bytes**, not strings. `Buffer` is Node's built-in type for bytes. `Buffer.from(text)` converts a string into bytes.

```js
  await image
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .toFile(outputPath);
```
- **Method chaining:** each method returns the image object, so you can call the next one with `.` straight away.
- `.composite([...])` takes an **array** (`[ ]`) of layers. Each layer is an **object** (`{ }`) — here only one: our SVG, placed at the top-left corner (`top: 0, left: 0`) since it's the same size as the photo.
- `.toFile(outputPath)` saves it. It's slow (writes to disk) → returns a Promise → `await`.

```js
  console.log(`Saved watermarked image to ${outputPath}`);
}

addWatermark();
```

## Run it
```bash
node watermark.js
```
Open `output.png` in Finder. You should see the text bottom-right.

---

## Experiments (do at least 2)
1. Change `watermarkText` to your website URL.
2. Make it bigger: `width / 10`. Then smaller: `width / 40`.
3. Move it to the **top-left**: what should `x`, `y` and `text-anchor` become? (Hint: `text-anchor="start"`, and remember `y` is the text's *baseline* — the bottom of the letters.)
4. Change `fill` to `"black"` and `fill-opacity` to `"0.3"`.

## Check yourself
1. Why do we calculate `fontSize` from `width` instead of writing `40`?
2. What's the difference between `[ ]` and `{ }`?
3. Why does `.toFile()` need `await` but `Math.round()` doesn't?
