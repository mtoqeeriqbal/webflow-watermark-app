# Watermark Studio

A Webflow App that adds **text or logo watermarks** to images, both in a site's **Assets** and inside **CMS Image fields**, so you can protect and brand your images without leaving Webflow.

> **Status:** early development. The watermark engine and a browser preview work; the Webflow integration is the next big phase.
> This project is also a **learning project**: every step is documented in [`lessons/`](lessons/README.md).

---

## 1. The problem

Webflow has no built-in way to watermark images. Today that means editing every image in Photoshop or Canva, re-uploading it, and repeating the whole process for each CMS item. For portfolios, photography, real-estate or product sites with many images, it is slow and easy to get wrong.

## 2. The idea

Pick an image (or a whole CMS collection), choose a watermark (text or logo), position and size, and let the app:

1. download the original,
2. draw the watermark on a **copy**,
3. upload the copy to the site's Assets,
4. (for CMS) swap the item's image field to the watermarked copy,
5. **keep the original's ID** so the change can be undone.

The original image is never overwritten.

---

## 3. Features

### Version 1 (target)
- Text watermark or logo watermark
- 5 positions: top-left, top-right, bottom-left, bottom-right, center
- Size as a percentage of the image width (so it looks right on any image size)
- Live preview before applying
- Apply to a selected site image, or to a CMS Image field (one item or bulk)
- Restore the original

### Later
- Opacity control (the engine technique is already documented in [`lessons/05-logo-opacity.md`](lessons/05-logo-opacity.md))
- Tiled / repeated watermark across the whole image
- Text colour, font and shadow
- Auto-watermark new CMS items via webhooks
- Saved watermark presets per site
- Skip images that are already watermarked

---

## 4. How it works

```
 ┌───────────────────────────┐        ┌────────────────────────────┐
 │  Designer Extension       │        │  Backend (Node + Express)  │
 │  (panel inside Webflow)   │        │                            │
 │                           │ settings│  OAuth with Webflow        │
 │  user picks:              │ ──────► │  Data API (Assets + CMS)   │
 │  type / text / position / │        │  addWatermark(image, s)    │
 │  size  + live preview     │ ◄────── │  uploads the new asset     │
 └───────────────────────────┘ result  └────────────────────────────┘
```

### The one idea everything is built around: the `settings` object

Every control in the panel maps to one key. This object is what the preview, the engine and (later) the server all share:

```js
const settings = {
  type: "text",            // "text" | "logo"
  text: "© Toqeer",        // used when type is "text"
  logoPath: "logo.png",    // used when type is "logo"
  position: "bottom-right",// top-left | top-right | bottom-left | bottom-right | center
  size: 0.2,               // watermark width = 20% of the image width
};
```

### The engine (already working)

`watermark-engine.js` exports `addWatermark(input, settings)`:

- `input` is a file path **or a Buffer** (later: bytes downloaded from Webflow)
- builds a **layer** (a text SVG, or the resized logo) whose width is `image width × size`
- calculates `left`/`top` with `getPosition(...)` using a padding of `image width / 40`
- composites the layer onto the image with [sharp](https://sharp.pixelplumbing.com/)
- **returns a PNG Buffer**; it does not save or upload anything, the caller decides

### The preview (already working)

`preview/` is a plain HTML + JS page. It reads a photo from a file input, draws it on a `<canvas>`, then draws the watermark with the same `settings` logic and updates live when controls change. This is the prototype of the Designer Extension panel.

---

## 5. Webflow app details

| Item | Choice |
|---|---|
| App type | **Hybrid App**: Designer Extension + Data Client |
| Designer Extension | UI inside the Designer: settings, preview, select site assets |
| Data Client | OAuth + Data API: read/write Assets and CMS items |
| Workspace | Webflow **Developer Workspace** (approved) |
| Distribution | Private / personal use first; Marketplace later (if shared) |
| Planned scopes | `sites:read`, `assets:read`, `assets:write`, `cms:read`, `cms:write` (optionally `pages:read`, `authorized_user:read`) |
| Homepage URL | https://toqeeriqbal.com |
| Redirect URI | placeholder for now; the real URL is set when the backend exists (local tunnel, then hosting) |

### Why a backend is needed
- The **Client Secret** must never be in browser code.
- CMS access uses OAuth + the Data API, which needs that secret.
- Watermarking many images is heavy work that belongs on a server, not in a browser tab.

### Key design decisions
- **Never overwrite originals.** A watermark creates a *new* asset; the original asset ID is stored so it can be restored.
- **Layer-based engine.** Text and logo both become a layer with a known width and height, so placement logic is written once.
- **Settings as plain data.** The settings object holds only strings and numbers, so it can be sent from the panel to the server as JSON.
- **v1 without opacity.** Logos are applied at 100%. Opacity is deferred until it's needed.

### Webflow concepts to confirm when building the integration
Exact Data API endpoints, rate limits, asset upload flow (metadata first, then file upload), and how CMS image fields reference assets will be confirmed against the official Webflow docs in the Backend phase.

---

## 6. Tech stack

| Part | Tool |
|---|---|
| Runtime | Node.js (v20+; developed on v24) |
| Image processing | [sharp](https://sharp.pixelplumbing.com/) |
| Preview | HTML, CSS, plain JavaScript, Canvas API |
| Panel (planned) | Webflow CLI + plain JavaScript (no React at first) |
| Server (planned) | Express |
| Storage (planned) | a JSON file at first; a free Postgres tier if it grows |
| Hosting (planned) | local first; a free tier (e.g. Render) for personal use |

Estimated running cost for personal use: **$0**. A small always-on server later is roughly $5–7/month.

---

## 7. Project structure

```
webflow-watermark/
├── watermark-engine.js   # the core: addWatermark(input, settings)
├── test.js               # runs the engine on input.png and writes output-test-*.png
├── watermark.js          # early lesson script (kept for reference)
├── input.png             # sample photo
├── logo.png              # sample logo
├── preview/
│   ├── index.html        # browser preview page
│   └── app.js            # canvas drawing + live controls
├── lessons/              # step-by-step notes for every lesson
├── package.json
└── README.md
```

Generated files named `output*.png` are git-ignored.

---

## 8. Getting started

```bash
git clone https://github.com/mtoqeeriqbal/webflow-watermark.git
cd webflow-watermark
npm install
node test.js
```

This reads `input.png` and writes `output-test-text.png` and `output-test-logo.png`.

Use the engine in your own script:

```js
import fs from "node:fs/promises";
import { addWatermark } from "./watermark-engine.js";

const photo = await fs.readFile("input.png");
const result = await addWatermark(photo, {
  type: "logo",
  logoPath: "logo.png",
  position: "bottom-right",
  size: 0.2,
});
await fs.writeFile("output.png", result);
```

Open the live preview by opening `preview/index.html` in a browser (double-click is enough).

---

## 9. Security notes

- Never commit secrets. `.env` is git-ignored; the Webflow **Client Secret** will live there.
- Never put the Client Secret in the panel or any browser code.
- Store access tokens on the server only.

---

## 10. Roadmap

| Phase | What | Status |
|---|---|---|
| 1 | Node basics: watermark one image, the `addWatermark` engine | done |
| 2 | Browser canvas preview with live controls | in progress (logo option next) |
| 3 | Designer Extension: Webflow CLI, Designer API, list and watermark site assets | planned |
| 4 | Backend + OAuth: Express, `.env`, Data API, watermark CMS images | planned |
| 5 | Pro features: bulk apply, restore originals, webhooks, error handling | planned |
| 6 | Deploy and (optionally) submit to the Marketplace | planned |

See [`lessons/README.md`](lessons/README.md) for the lesson-by-lesson index.

---

## 11. Known limitations (current)

- Text width in the Node engine is estimated (about `0.6 × font size` per character), so text placement is approximate; logos are exact.
- Special characters in text (like `&` or `<`) are not yet escaped in the SVG.
- The preview's text watermark is white only, with no colour or shadow option yet.
- No Webflow integration yet.

---

## 12. Author

Toqeer Iqbal, Webflow developer: https://toqeeriqbal.com
