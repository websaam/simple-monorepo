const fs = require("fs");
const path = require("path");
const { build } = require('esbuild');

const packagesDir = path.resolve(__dirname, "..", "packages");
const directories = fs.readdirSync(packagesDir);

directories.forEach((dir) => {
  const packageDir = path.join(packagesDir, dir);
  if (fs.statSync(packageDir).isDirectory()) {
    console.log(`Building UMD for ${dir}...`);

    build({
      entryPoints: [path.join(packageDir, 'src', 'index.ts')],
      outfile: path.join(packageDir, 'dist', 'umd', 'index.js'),
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }
});
