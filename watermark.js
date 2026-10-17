import sharp from "sharp";

const inputPath = "input.png";
const logoPath = "logo.png";
const outputPath = "output-logo.png";


async function addLogoWatermark() {
  // 1. Read the photo size
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

    // 2. Decide how big the logo should be
  const logoWidth = Math.round(width / 6);
  const padding = Math.round(width / 100);

    // 3. Resize the logo
  const logoBuffer = await sharp(logoPath)
    .resize({ width: logoWidth })
    .toBuffer();

      // 4. Find the resized logo's height
  const logoInfo = await sharp(logoBuffer).metadata();
  const logoHeight = logoInfo.height;

    // 5. Calculate the position (bottom-right)
  const left = width - logoWidth - padding;
  const top = height - logoHeight - padding;

    // 6. Place the logo and save
  await image
    .composite([{ input: logoBuffer, top, left }])
    .toFile(outputPath);

  console.log(`Saved ${outputPath}: logo ${logoWidth}x${logoHeight} at left ${left}, top ${top}`);
}

addLogoWatermark();
