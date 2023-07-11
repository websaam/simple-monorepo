const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const packagesDir = path.resolve(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

packageDirs.forEach((dir) => {
  const packagePath = path.resolve(packagesDir, dir);
  const webpackConfigPath = path.resolve(packagePath, "webpack.config.js");
  if (fs.existsSync(webpackConfigPath)) {
    console.log(`Building UMD bundle for package ${dir}...`);
    execSync("npx webpack", { cwd: packagePath, stdio: "inherit" });
  }
});

console.log("UMD bundles built successfully.");
