# Lesson 8 — Draw a text watermark on the canvas

**Goal:** after picking a photo, "© Toqeer" appears bottom-right, using the same `settings` idea as the Node engine.
**Concepts:** state variables, a re-callable `draw()`, `ctx.fillText`, `measureText`, `textAlign`/`textBaseline`.

## Why restructure
Drawing inside `onload` runs once. A live preview must **redraw whenever a setting changes**. A canvas has no undo → repaint the photo, then the watermark on top, from a `draw()` function.

## `preview/app.js` (state of the project after this lesson)
```js
const photoInput = document.getElementById("photoInput");
const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

let currentImage = null;

const settings = {
  text: "© Toqeer",
  position: "bottom-right",
  size: 0.2,
};

function draw() {
  if (!currentImage) return;

  canvas.width = currentImage.naturalWidth;
  canvas.height = currentImage.naturalHeight;
  ctx.drawImage(currentImage, 0, 0);

  drawText();
}

function drawText() {
  const padding = Math.round(canvas.width / 40);
  const targetWidth = canvas.width * settings.size;

  ctx.font = "100px Arial";
  const measured = ctx.measureText(settings.text).width;
  const fontSize = Math.round((100 * targetWidth) / measured);

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  ctx.fillText(settings.text, canvas.width - padding, canvas.height - padding);
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    currentImage = img;
    draw();
    URL.revokeObjectURL(url);
  };

  img.src = url;
});
```

## Concepts
| Code | Meaning |
|---|---|
| `let currentImage = null` | **State variable**: remembers the photo so `draw()` can use it any time. `let` because it changes; `null` = nothing yet. |
| `settings` | Same keys as the Node engine (text, position, size). |
| Setting `canvas.width` | Also **clears** the canvas → clean slate each draw. |
| `ctx.font = "100px Arial"` | Same format as CSS `font`. |
| `ctx.measureText(t).width` | The browser tells us the **real** text width (Node needed a `0.6` guess). |
| `100 * targetWidth / measured` | Scale the font so the text is ≈ `targetWidth` wide. |
| `textAlign = "right"` | Right edge of text at `x` (same idea as SVG `text-anchor="end"`). |
| `textBaseline = "bottom"` | `y` is the bottom of the text. |
| `ctx.fillText(text, x, y)` | Draw the text. |
| `fillStyle = "rgba(255,255,255,0.6)"` | Opacity for free on canvas (no dest-in trick needed). |

## Check yourself
1. Why is drawing in `draw()` and not inside `onload`?
2. Why `let currentImage` and not `const`?
3. Why does `draw()` set `canvas.width` before `drawImage`?
4. What does `measureText` give that Node's `0.6` guess couldn't?

## Puzzle
Move the text to the **top-left**, 39px from both edges. (Change `textAlign`, `textBaseline` and the `fillText` arguments.)
