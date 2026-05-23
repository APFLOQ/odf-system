const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImages() {
  const publicDir = path.join(__dirname, 'public');
  
  // 1. Process favicon - convert to 32x32 PNG
  const faviconPath = path.join(publicDir, 'favicon.png');
  const faviconOutput = path.join(publicDir, 'favicon-32.png');
  
  if (fs.existsSync(faviconPath)) {
    await sharp(faviconPath)
      .resize(32, 32)
      .png({ quality: 90 })
      .toFile(faviconOutput);
    console.log('Favicon 32x32 created:', faviconOutput);
  }
  
  // 2. Analyze brain image quality
  const brainPath = path.join(publicDir, 'brain-hero.png');
  if (fs.existsSync(brainPath)) {
    const metadata = await sharp(brainPath).metadata();
    console.log('Brain image dimensions:', metadata.width, 'x', metadata.height);
    console.log('Brain image format:', metadata.format);
    
    // If it's small, it's low quality
    if (metadata.width < 1920 || metadata.height < 1080) {
      console.log('⚠️ Brain image is LOW RESOLUTION - needs higher quality source');
    }
  }
}

processImages().catch(console.error);