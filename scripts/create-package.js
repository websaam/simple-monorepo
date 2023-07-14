const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("What is the name of the new package? ", (packageName) => {
  // Create the new package
  const packagesDir = path.resolve(__dirname, "..", "packages", packageName);
  fs.mkdirSync(packagesDir, { recursive: true });

  const packageJson = {
    name: packageName,
    version: "1.0.0",
    main: "./dist/cjs/index.js",
    types: "./dist/cjs/index.d.ts",
    browser: "./dist/umd/index.js",
    scripts: {
      build: "tsc",
    },
    devDependencies: {
      typescript: "^4.0.0",
    },
  };

  fs.writeFileSync(
    path.join(packagesDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // The "composite" option enables project composition in TypeScript. It tells TypeScript to generate certain files in the output directory (outDir) that can be used to speed up subsequent builds and to enable tools to do more powerful project-wide checks and refactorings.
  const tsConfigJson = {
    extends: "../../tsconfig.json",
    compilerOptions: {
      outDir: "./dist/cjs",
      composite: true,
    },
    include: ["src/**/*.ts"],
  };
  fs.writeFileSync(
    path.join(packagesDir, "tsconfig.json"),
    JSON.stringify(tsConfigJson, null, 2)
  );

  const srcDir = path.join(packagesDir, "src");
  fs.mkdirSync(srcDir);
  fs.writeFileSync(path.join(srcDir, "index.ts"), "");

  // Add the new package to the root tsconfig.json
  const rootTsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
  const rootTsConfig = JSON.parse(fs.readFileSync(rootTsConfigPath, "utf8"));
  rootTsConfig.references.push({ path: `./packages/${packageName}` });

  // Add the new package to compilerOptions.paths
  if (!rootTsConfig.compilerOptions.paths) {
    rootTsConfig.compilerOptions.paths = {};
  }
  rootTsConfig.compilerOptions.paths[packageName] = [
    `./packages/${packageName}/src`,
  ];

  fs.writeFileSync(rootTsConfigPath, JSON.stringify(rootTsConfig, null, 2));

  readline.close();
});
