import {
  logoInput, typeRadios, photoInput,
  positionSelect, sizeRange, sizeLabel, textInput,
} from "./elements.js";
import { state, settings } from "./state.js";
import { draw } from "./draw.js";


typeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    settings.type = radio.value;
    draw();
  });
});

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
    state.image = img;
    draw();
    URL.revokeObjectURL(url);
  };

  img.src = url;
});


logoInput.addEventListener("change", () => {
  const file = logoInput.files[0];

  if (!file) return;

  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    state.logo = img;
    console.log(state.logo);
    draw();
    URL.revokeObjectURL(url);
  };

  img.src = url;
});


