# Lesson 7 — Show a photo in the browser (canvas)

**Goal:** pick a photo with a file input and see it on a `<canvas>`.
**Concepts:** the DOM, `getElementById`, events, File API, `Image`, canvas, `onload`.

## Files (`preview/`)
`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Watermark Preview</title>
  <style>
    body { font-family: sans-serif; padding: 24px; }
    canvas { max-width: 100%; border: 1px solid #ccc; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>Watermark Preview</h1>
  <input type="file" id="photoInput" accept="image/*" />
  <br />
  <canvas id="preview"></canvas>

  <script src="app.js"></script>
</body>
</html>
```
`app.js`
```js
const photoInput = document.getElementById("photoInput");
const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
  };

  img.src = url;
});
```
Open by double-clicking `preview/index.html` (or `open preview/index.html`).

## Concepts
| Code | Meaning |
|---|---|
| **DOM** | The page's HTML turned into JS objects; `document` is the root. |
| `getElementById("x")` | Find the element with `id="x"` (like `#x` in CSS). IDs are case-sensitive. |
| `canvas.getContext("2d")` | The "pen" for drawing, named `ctx`. |
| `addEventListener("change", fn)` | When the user picks a file, run `fn` (trigger + action, like a Webflow interaction). |
| `photoInput.files[0]` | First chosen file. |
| `if (!file) return;` | **Guard clause**: user cancelled → stop early. |
| `URL.createObjectURL(file)` | Temporary in-memory address for the file. |
| `new Image()` | An `<img>` in memory, not on the page. |
| `img.onload` | Runs **when loading finishes** (loading takes time). |
| `img.src = url` | **Starts** the loading. Set `onload` first, `src` last. |
| `ctx.drawImage(img, 0, 0)` | Paint the photo with its top-left at (0,0). |
| `URL.revokeObjectURL(url)` | Free the temporary address. |

## How the photo reaches `onload`
```
photoInput → file → url → img.src → img loads → onload runs
```
`photoInput` is only used in the first step. The link between picker and image is `img.src = url`. By the time `onload` runs, `img` already **is** the photo.

## Two sizes
| | Set by | Example |
|---|---|---|
| Resolution (real pixels) | `canvas.width/height` | 1558 × 901 |
| Display size | CSS (`max-width: 100%`) | shrinks to fit the window |
Drawing uses the real resolution; CSS only scales the look.

## Debugging tip
`console.log(photoInput)` → `null` means the id doesn't match (case!), or the script runs before the element exists, or `app.js` isn't found (404 in Console).

## Check yourself
1. What is the DOM?
2. Why is `<script>` at the bottom of `<body>`?
3. What is `ctx` for?
4. Why set `canvas.width` before `drawImage`?
