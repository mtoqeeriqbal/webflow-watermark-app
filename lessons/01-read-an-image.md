# Lesson 1 — Read an image with Node

**Goal:** run a script that opens a photo and prints its width, height and format.
**Concepts:** modules (`import`), packages, `const`, functions, `async/await`, objects & destructuring, `console.log`.

---

## Step 1 — Switch to modern modules
In `package.json` change:
```json
"type": "commonjs"
```
to
```json
"type": "module"
```
**Why:** JavaScript has two ways to load code from other files:
- old: `const sharp = require("sharp")` (CommonJS)
- modern: `import sharp from "sharp"` (ES Modules — same syntax as browsers and the Webflow extension)
We learn the modern one only.

## Step 2 — Install sharp
```bash
npm install sharp
```
- Downloads the `sharp` image library into a new `node_modules/` folder.
- Adds `"dependencies": { "sharp": "..." }` to `package.json`.
- Creates `package-lock.json` (exact versions — never edit by hand).

## Step 3 — Add a test photo
Copy any **landscape** (wide) photo into the project folder and rename it `input.jpg`.

## Step 4 — Create `watermark.js` and type this

```js
import sharp from "sharp";
```
- `import ... from "..."` loads code from a package or file.
- `sharp` is now a **function** we can call to work with images.

```js
const inputPath = "input.jpg";
```
- `const` creates a **variable** that cannot be reassigned. Use `const` by default; use `let` only when the value must change.
- `"input.jpg"` is a **string** (text). It's a path *relative* to where you run the script.

```js
async function readImageInfo() {
```
- `function` = a reusable block of code with a name.
- `async` means "this function will **wait** for slow things" (reading files, network). Inside it we can use `await`.

```js
  const image = sharp(inputPath);
```
- Calls `sharp()` with our path. It returns an **object** representing the image (nothing is read yet).

```js
  const info = await image.metadata();
```
- `.metadata()` reads the file from disk — that takes time, so it returns a **Promise** ("I'll give you the answer later").
- `await` pauses *this function* until the Promise finishes, then gives us the result.

```js
  console.log(info);
```
- Prints the whole result object to the Terminal. Look at it — it's a big **object** with `key: value` pairs.

```js
  const { width, height, format } = info;
  console.log(`Size: ${width} x ${height}, format: ${format}`);
}
```
- `{ width, height, format } = info` is **destructuring**: pull these keys out of the object into variables. Same as:
  `const width = info.width; const height = info.height; ...`
- Backticks `` ` `` make a **template string**; `${...}` inserts a value into the text.
- `}` closes the function.

```js
readImageInfo();
```
- Defining a function does nothing on its own — this line **calls** (runs) it.

## Step 5 — Run it
```bash
node watermark.js
```
Expected: a big object, then a line like `Size: 6000 x 4000, format: jpeg`.

---

## Check yourself
1. What's the difference between `const` and `let`?
2. Why do we need `await` before `image.metadata()`?
3. What happens if you delete the last line `readImageInfo();`?
4. Try: change `inputPath` to a file that doesn't exist. Read the error message. What does it say?
