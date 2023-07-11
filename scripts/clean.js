const fs = require("fs");
const path = require("path");

const packagesDir = path.resolve(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

packageDirs.forEach((dir) => {
  const distDir = path.resolve(packagesDir, dir, "dist");
  if (fs.existsSync(distDir)) {
    fs.rmdirSync(distDir, { recursive: true });
    console.log(`Deleted ./dist in ${dir}`);
  }
});
