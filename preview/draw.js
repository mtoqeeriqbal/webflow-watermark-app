import { getPosition } from "./position.js";
import { canvas, ctx } from "./elements.js";
import { state, settings } from "./state.js";

export function draw() {
  if (!state.image) return;
  canvas.width = state.image.naturalWidth;
  canvas.height = state.image.naturalHeight;
  ctx.drawImage(state.image, 0, 0);
  
  if (settings.type === "logo") {
    drawLogo();
  } else {
    drawText();
  }
}

export function drawText() {
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

export function drawLogo() {
  if (!state.logo) return;

  const logoW = Math.round(canvas.width * settings.size);
  const logoH = Math.round(state.logo.naturalHeight * (logoW / state.logo.naturalWidth));

  const padding = Math.round(canvas.width / 40);
  const { left, top } = getPosition(
    settings.position, canvas.width, canvas.height, logoW, logoH, padding
  );

  ctx.drawImage(state.logo, left, top, logoW, logoH);
}
