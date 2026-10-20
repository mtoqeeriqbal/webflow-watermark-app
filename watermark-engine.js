import sharp from "sharp";

export const defaults = {
  type: "text",
  text: "© Watermark",
  logoPath: "logo.png",
  position: "bottom-right",
  size: 0.2,
};


export function mergeSettings(userSettings = {}){
    return {...defaults, ...userSettings};
}

export function getPosition(position, imgW, imgH, layerW, layerH, padding){

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

  return sharp(Buffer
    .from(svg))
    .png()
    .toBuffer();
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