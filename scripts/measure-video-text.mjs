import fs from "fs";
import { chromium } from "playwright";

async function measure() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Read base64 of video-inspect-raw.png
  const imgBuffer = fs.readFileSync("screenshots/video-inspect-raw.png");
  const base64 = imgBuffer.toString("base64");

  const results = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const id = ctx.getImageData(0, 0, img.width, img.height);
        const data = id.data;

        let minX = img.width, maxX = 0, minY = img.height, maxY = 0;

        // Find non-black pixels (brightness > 30)
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            // Exclude small star in bottom right
            if (x > 1300 && y > 700) continue;
            if (r > 35 || g > 35 || b > 35) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        resolve({
          width: img.width,
          height: img.height,
          textBounds: {
            minX,
            maxX,
            width: maxX - minX,
            minY,
            maxY,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
          }
        });
      };
      img.src = "data:image/png;base64," + b64;
    });
  }, base64);

  console.log("=== Video Text Pixel Measurement ===");
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

measure();
