import fs from "node:fs/promises";
import { addWatermark } from "./watermark-engine.js";

const photo = await fs.readFile("input.png");

const textResult = await addWatermark(photo, {
  type: "text",

});
await fs.writeFile("output-test-text.png", textResult);

const logoResult = await addWatermark(photo, {
  type: "logo",

});
await fs.writeFile("output-test-logo.png", logoResult);

console.log("Done");