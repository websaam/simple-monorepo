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

/** ========== Check imports in each file from package, then update tsconfig.json  */
const directories = fs.readdirSync(packagesDir);
directories.forEach((packageDirName) => {
  const packageDir = path.join(packagesDir, packageDirName);
  const tsConfigPath = path.join(packageDir, "tsconfig.json");

  let tsConfig;
  try {
    tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf8"));
  } catch (e) {
    console.error(
      `Failed to read or parse tsconfig.json for ${packageDirName}`
    );
    process.exit(1);
  }

  tsConfig.references = [];

  const packageFiles = fs.readdirSync(path.join(packageDir, "src"));

  packageFiles.forEach((file) => {
    const filePath = path.join(packageDir, "src", file);
    const code = fs.readFileSync(filePath, "utf8");

    const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const importedPackageName = match[1];

      if (directories.includes(importedPackageName)) {
        const existingRefs = tsConfig.references.map((ref) => ref.path);
        const relativePath = `../${importedPackageName}`;

        if (!existingRefs.includes(relativePath)) {
          tsConfig.references.push({ path: relativePath });
        }
      }
    }
  });

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
});
