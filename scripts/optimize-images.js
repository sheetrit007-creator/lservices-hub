import sharp from "sharp";
import { readdir, stat, rename } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const IMG_DIR = new URL("../client/public/img", import.meta.url).pathname;

const QUALITY = { jpeg: 80, webp: 82, png: 90 };
const MAX_WIDTH = 1920;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await getFiles(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) files.push(full);
  }
  return files;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isLogo = filePath.includes("logo") || filePath.includes("Logo") || filePath.includes("mascot") || filePath.includes("Mascot");

  const originalStat = await stat(filePath);
  const originalKB = Math.round(originalStat.size / 1024);

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    // Resize if wider than MAX_WIDTH (logos/PNG keep alpha, use PNG → WebP)
    const pipeline = img.resize({
      width: isLogo ? Math.min(meta.width, 800) : MAX_WIDTH,
      withoutEnlargement: true,
    });

    let outPath;
    if (ext === ".png") {
      outPath = filePath.replace(/\.png$/i, ".webp");
      await pipeline.webp({ quality: QUALITY.webp, lossless: false, nearLossless: isLogo }).toFile(outPath);
    } else {
      outPath = filePath.replace(/\.(jpe?g)$/i, ".webp");
      await pipeline.webp({ quality: QUALITY.webp }).toFile(outPath);
    }

    const newStat = await stat(outPath);
    const newKB = Math.round(newStat.size / 1024);
    const saving = Math.round((1 - newStat.size / originalStat.size) * 100);

    console.log(`✅ ${path.basename(filePath)} ${originalKB}KB → ${path.basename(outPath)} ${newKB}KB  (${saving}% saved)`);
    return { original: filePath, webp: outPath, savedBytes: originalStat.size - newStat.size };
  } catch (err) {
    console.error(`❌ ${path.basename(filePath)}: ${err.message}`);
    return null;
  }
}

const files = await getFiles(IMG_DIR);
console.log(`Found ${files.length} images in ${IMG_DIR}\n`);

let totalSaved = 0;
for (const f of files) {
  const result = await optimizeFile(f);
  if (result) totalSaved += result.savedBytes;
}

console.log(`\nTotal bandwidth saved: ${Math.round(totalSaved / 1024 / 1024 * 10) / 10} MB`);
