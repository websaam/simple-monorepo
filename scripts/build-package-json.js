// scripts/post-build.js

const fs = require("fs");
const path = require("path");

const packagesDir = path.join(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

packageDirs.forEach((dir) => {
  const packageDir = path.join(packagesDir, dir);
  const packageJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) return;

  const packageJson = require(packageJsonPath);
  const updatedDependencies = {};

  for (let dep in packageJson.dependencies) {
    if (packageJson.dependencies[dep] === "*") {
      // Check if dep is another package in the monorepo
      const depPath = path.join(packagesDir, dep, "package.json");
      if (fs.existsSync(depPath)) {
        // Get actual version from dep's own package.json
        const depPackageJson = require(depPath);
        updatedDependencies[dep] = depPackageJson.version;
      } else {
        // Get actual version from the root package.json
        const rootPackageJson = require(path.join(
          __dirname,
          "..",
          "package.json"
        ));
        if (
          !rootPackageJson.dependencies ||
          !rootPackageJson.dependencies[dep]
        ) {
          console.error(`No matching version found for ${dep}`);
          process.exit(1);
        }
        updatedDependencies[dep] = rootPackageJson.dependencies[dep];
      }
    } else {
      updatedDependencies[dep] = packageJson.dependencies[dep];
    }
  }

  packageJson.dependencies = updatedDependencies;

  // Update paths to built files
  if (packageJson.main.startsWith("./dist")) {
    packageJson.main = packageJson.main.replace("./dist", ".");
  }
  if (packageJson.types && packageJson.types.startsWith("./dist")) {
    packageJson.types = packageJson.types.replace("./dist", ".");
  }
  if (packageJson.browser && packageJson.browser.startsWith("./dist")) {
    packageJson.browser = packageJson.browser.replace("./dist", ".");
  }

  // Write the updated package.json to the dist folder
  const distDir = path.join(packageDir, "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  fs.writeFileSync(
    path.join(distDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
});
