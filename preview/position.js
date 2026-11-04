// ===== 3. HELPERS =====


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
