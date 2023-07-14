const fs = require("fs");
const path = require("path");

// Read the root tsconfig.json
const rootTsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
const rootTsConfig = JSON.parse(fs.readFileSync(rootTsConfigPath, "utf8"));

// Get the list of packages from the packages directory
const packagesDir = path.resolve(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

// Check each package
packageDirs.forEach((packageDir) => {
  const packagePath = path.join(packagesDir, packageDir);
  const packageJsonPath = path.join(packagePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Missing package.json for package "${packageDir}"`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const packageName = packageJson.name;

  const packageExistsInPaths =
    rootTsConfig.compilerOptions.paths &&
    rootTsConfig.compilerOptions.paths[packageName];

  const packageExistsInReferences = rootTsConfig.references.some(
    (ref) => ref.path === `./packages/${packageDir}`
  );

  if (!packageExistsInPaths || !packageExistsInReferences) {
    console.error(
      `Package "${packageName}" is not correctly configured in tsconfig.json`
    );
  }
});

// Orphaned references check
const orphanedReferences = rootTsConfig.references.filter(
  (ref) => {
    // Get the package directory name from the reference path
    const refPackageDir = ref.path.replace("./packages/", "").split("/").pop();

    // Check if a directory with this name exists in the packages directory
    return !packageDirs.includes(refPackageDir);
  }
);

if (orphanedReferences.length > 0) {
  console.error(
    `The following packages are declared in references but do not exist: ${orphanedReferences
      .map((ref) => ref.path.replace("./packages/", ""))
      .join(", ")}`
  );
}

// Check imports and update tsconfig.json references
const directories = fs.readdirSync(packagesDir);
directories.forEach((packageDirName) => {
  const packageDir = path.join(packagesDir, packageDirName);
  const tsConfigPath = path.join(packageDir, "tsconfig.json");

  let tsConfig;
  try {
    tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf8"));
  } catch (e) {
    console.error(`Failed to read or parse tsconfig.json for ${packageDirName}`);
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

      if (directories.includes(importedPackageName.split("/").pop())) {
        const existingRefs = tsConfig.references.map((ref) => ref.path);
        const relativePath = `../${importedPackageName.split("/").pop()}`;

        if (!existingRefs.includes(relativePath)) {
          tsConfig.references.push({ path: relativePath });
        }
      }
    }
  });

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
});
