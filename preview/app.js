const photoInput = document.getElementById("photoInput");
const positionSelect = document.getElementById("positionSelect");
const sizeRange = document.getElementById("sizeRange");
const sizeLabel = document.getElementById("sizeLabel");
const textInput = document.getElementById("textInput");

const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");


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