const sharp = require('sharp');
const fs = require('fs');
const pngToIco = require('png-to-ico');
const size = 512;
const radius = 128; // 圆角半径
const input = 'input.png'; // 你的原图
const output = 'icon.png';
const sizes = [16, 32, 128, 256, 512, 1024];
const icoSizes = [16, 32, 48, 64, 128, 256]; // Windows ico 推荐尺寸

// 生成白色圆角背景
const roundedRectSvg = `
  <svg width="${size}" height="${size}">
    <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>
`;

(async () => {
  // 1. 生成带白色圆角背景的 PNG
  const bg = await sharp(Buffer.from(roundedRectSvg))
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([{ input, gravity: 'center' }])
    .toFile(output);

  console.log('生成带白色圆角背景的图片:', output);

  // 2. 批量生成多尺寸 PNG
  if (!fs.existsSync('icon.iconset')) fs.mkdirSync('icon.iconset');

  for (const size of sizes) {
    await sharp(output)
      .resize(size, size)
      .toFile(`icon.iconset/icon_${size}x${size}.png`);
    await sharp(output)
      .resize(size * 2, size * 2)
      .toFile(`icon.iconset/icon_${size}x${size}@2x.png`);
  }

  console.log('已批量生成多尺寸 PNG 到 icon.iconset 目录');
  console.log('最后用 iconutil -c icns icon.iconset 生成 icns 文件');

  // 3. 生成 Windows ico 文件
  const icoPngs = [];
  for (const size of icoSizes) {
    const buf = await sharp(output).resize(size, size).png().toBuffer();
    icoPngs.push(buf);
  }
  const icoBuf = await pngToIco(icoPngs);
  fs.writeFileSync('icon.ico', icoBuf);
  console.log('已生成 Windows 用的 icon.ico');
})();
