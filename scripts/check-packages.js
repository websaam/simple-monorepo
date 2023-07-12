// check-packages.js
const fs = require("fs");
const path = require("path");

// Read the root tsconfig.json
const rootTsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
const rootTsConfig = JSON.parse(fs.readFileSync(rootTsConfigPath, "utf8"));

// Get the list of packages from the packages directory
const packagesDir = path.resolve(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

// Check each package
packageDirs.forEach((packageName) => {
  const packageExistsInPaths =
    rootTsConfig.compilerOptions.paths &&
    rootTsConfig.compilerOptions.paths[packageName];

  const packageExistsInReferences = rootTsConfig.references.some(
    (ref) => ref.path === `./packages/${packageName}`
  );

  if (!packageExistsInPaths || !packageExistsInReferences) {
    console.error(
      `Package "${packageName}" is not correctly configured in tsconfig.json`
    );
  }
});

// Check for orphaned packages in tsconfig.json
const orphanedPaths = Object.keys(
  rootTsConfig.compilerOptions.paths || {}
).filter((path) => !packageDirs.includes(path));
const orphanedReferences = rootTsConfig.references
  .map((ref) => ref.path.replace("./packages/", ""))
  .filter((path) => !packageDirs.includes(path));

if (orphanedPaths.length > 0) {
  console.error(
    `The following packages are declared in compilerOptions.paths but do not exist: ${orphanedPaths.join(
      ", "
    )}`
  );
}

if (orphanedReferences.length > 0) {
  console.error(
    `The following packages are declared in references but do not exist: ${orphanedReferences.join(
      ", "
    )}`
  );
}
