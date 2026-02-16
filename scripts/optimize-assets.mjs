import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await optimizeImages(filePath);
        } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
            const originalSize = stat.size;
            if (originalSize < 500 * 1024) continue; // Skip small files

            console.log(`Optimizing ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);

            try {
                const buffer = fs.readFileSync(filePath);
                const image = sharp(buffer);
                const metadata = await image.metadata();

                if (metadata.width > MAX_WIDTH) {
                    image.resize({ width: MAX_WIDTH });
                }

                if (file.toLowerCase().endsWith('.png')) {
                    image.png({ quality: QUALITY, compressionLevel: 9 });
                } else {
                    image.jpeg({ quality: QUALITY });
                }

                const optimizedBuffer = await image.toBuffer();
                fs.writeFileSync(filePath, optimizedBuffer);

                const newSize = optimizedBuffer.length;
                console.log(`  -> Saved ${(originalSize - newSize) / 1024 / 1024 / ((originalSize / 1024 / 1024) || 1) * 100}% (${(newSize / 1024 / 1024).toFixed(2)} MB)`);
            } catch (_err) {
                console.error(`Error optimizing ${file}:`, _err);
            }
        }
    }
}

console.log('Starting asset optimization...');
optimizeImages(publicDir).then(() => {
    console.log('Asset optimization complete.');
}).catch(err => {
    console.error('Fatal error:', err);
});
