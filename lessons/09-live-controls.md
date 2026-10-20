# Lesson 9 — Live controls (text box, position dropdown, size slider)

**Status:** TO DO — code below is the target for this lesson.
**Goal:** the preview updates **while you type or drag**.
**Concepts:** form elements, the `input` event, `.value` is always a string, `Number()`, `textContent`, reusing `getPosition` from the engine.

## 1. `index.html` — add between `<h1>` and the file input
```html
<div class="controls">
  <label>Text
    <input type="text" id="textInput" value="© Toqeer" />
  </label>

  <label>Position
    <select id="positionSelect">
      <option value="bottom-right">Bottom right</option>
      <option value="bottom-left">Bottom left</option>
      <option value="top-right">Top right</option>
      <option value="top-left">Top left</option>
      <option value="center">Center</option>
    </select>
  </label>

  <label>Size
    <input type="range" id="sizeRange" min="5" max="50" value="20" />
    <span id="sizeLabel">20%</span>
  </label>
</div>
```
CSS (inside `<style>`):
```css
.controls { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
```
`<option value>` = what JS reads (matches `getPosition` keys); the text between tags = what the user sees.

## 2. `app.js` — new element references (top)
```js
const textInput = document.getElementById("textInput");
const positionSelect = document.getElementById("positionSelect");
const sizeRange = document.getElementById("sizeRange");
const sizeLabel = document.getElementById("sizeLabel");
```

## 3. `app.js` — copy `getPosition` from the engine (no `export`)
```js
function getPosition(position, imgW, imgH, layerW, layerH, padding) {
  const positions = {
    "top-left":     { left: padding, top: padding },
    "top-right":    { left: imgW - layerW - padding, top: padding },
    "bottom-left":  { left: padding, top: imgH - layerH - padding },
    "bottom-right": { left: imgW - layerW - padding, top: imgH - layerH - padding },
    "center":       { left: Math.round((imgW - layerW) / 2), top: Math.round((imgH - layerH) / 2) },
  };

  return positions[position] || positions["bottom-right"];
}
```
(Browsers block `import` between local files opened by double-click, so we copy for now.)

## 4. `app.js` — new `drawText`
```js
function drawText() {
  if (!settings.text) return;

  const padding = Math.round(canvas.width / 40);
  const targetWidth = canvas.width * settings.size;

  ctx.font = "100px Arial";
  const measured = ctx.measureText(settings.text).width;
  const fontSize = Math.round((100 * targetWidth) / measured);

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const textWidth = ctx.measureText(settings.text).width;
  const { left, top } = getPosition(
    settings.position, canvas.width, canvas.height, textWidth, fontSize, padding
  );

  ctx.fillText(settings.text, left, top);
}
```
- `if (!settings.text) return;` → empty box would make `measured = 0` → `100 * targetWidth / 0 = Infinity`.
- `textAlign = "left"` + `textBaseline = "top"` → `(left, top)` is the text's top-left corner, same convention as `composite` in Node.

## 5. `app.js` — connect the controls (bottom)
```js
textInput.addEventListener("input", () => {
  settings.text = textInput.value;
  draw();
});

positionSelect.addEventListener("input", () => {
  settings.position = positionSelect.value;
  draw();
});

sizeRange.addEventListener("input", () => {
  settings.size = Number(sizeRange.value) / 100;
  sizeLabel.textContent = sizeRange.value + "%";
  draw();
});
```

## Concepts
| Code | Meaning |
|---|---|
| `"input"` event | Fires on **every** change (each keystroke / slider step). `"change"` fires only when you finish. |
| `.value` | Always a **string** (`"20"`). |
| `Number("20")` | Converts to a real number. `"20" + 5 = "205"` but `Number("20") + 5 = 25`. |
| `textContent` | Text inside an element (like editing a Text Block in Webflow). |
| **Update state, then redraw** | `settings.x = ...; draw();` — the pattern behind nearly every UI. |

## Experiments
1. Drag the slider / change the dropdown → live update.
2. Remove the `if (!settings.text) return;` guard, clear the text box → what happens?
3. Change `"input"` to `"change"` on the slider → what differs?
4. Type `settings` in the DevTools console → do values match the UI?

## Check yourself
1. Why update `settings` and then call `draw()` instead of drawing in each listener?
2. Why convert `.value` with `Number()`?
3. `input` vs `change` event?
4. What bug does the empty-text guard prevent?
