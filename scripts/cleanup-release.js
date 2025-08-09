#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Usage: node scripts/cleanup-release.js dmg|exe
const allowExt = (process.argv[2] || '').toLowerCase();
if (!['dmg', 'exe'].includes(allowExt)) {
  console.error('cleanup-release: require one argument: dmg|exe');
  process.exit(1);
}

const releaseDir = path.resolve(__dirname, '..', 'apps', 'app', 'release');

function shouldKeep(file) {
  // keep only requested installer files
  return file.toLowerCase().endsWith(`.${allowExt}`);
}

function removeRecursive(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  const stat = fs.lstatSync(targetPath);
  if (stat.isDirectory()) {
    fs.readdirSync(targetPath).forEach((name) => removeRecursive(path.join(targetPath, name)));
    fs.rmdirSync(targetPath);
  } else {
    fs.unlinkSync(targetPath);
  }
}

if (!fs.existsSync(releaseDir)) {
  console.log('cleanup-release: release folder not found, skip');
  process.exit(0);
}

const entries = fs.readdirSync(releaseDir);
for (const name of entries) {
  const full = path.join(releaseDir, name);
  const lower = name.toLowerCase();

  // Remove known byproducts
  if (
    lower.endsWith('.blockmap') ||
    lower.endsWith('.yml') ||
    lower === 'builder-effective-config.yaml' ||
    lower === 'builder-debug.yml' ||
    lower.startsWith('mac') // mac, mac-arm64 directories
  ) {
    removeRecursive(full);
    continue;
  }

  // Remove anything that is not the allowed installer
  if (fs.lstatSync(full).isFile() && !shouldKeep(name)) {
    removeRecursive(full);
  }
  // Remove any other directories
  if (fs.lstatSync(full).isDirectory()) {
    removeRecursive(full);
  }
}

console.log(`cleanup-release: kept only *.${allowExt} in ${releaseDir}`);


