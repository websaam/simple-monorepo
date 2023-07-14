const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("What is the name of the new package? ", (packageName) => {
  const nameParts = packageName.split("/");
  const name = nameParts[nameParts.length - 1]; // Use last part of name for directory
  const packagesDir = path.resolve(__dirname, "..", "packages", name);

  fs.mkdirSync(packagesDir, { recursive: true });

  const packageJson = {
    name: packageName,
    version: "0.0.1",
    main: "./dist/cjs/src/index.js",
    module: "./dist/esm/index.js",
    browser: "./dist/umd/index.js",
    types: "./dist/types/src/index.d.ts",
    scripts: {
      build: "tsc",
    },
    devDependencies: {
      typescript: "^4.0.0",
    },
    publishConfig: {
      access: "public",
    },
  };

  fs.writeFileSync(
    path.join(packagesDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  const tsConfigJson = {
    extends: "../../tsconfig.json",
    compilerOptions: {
      outDir: "./dist/cjs",
      declaration: true,
      declarationDir: "./dist/types",
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

  const rootTsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
  const rootTsConfig = JSON.parse(fs.readFileSync(rootTsConfigPath, "utf8"));
  rootTsConfig.references.push({ path: `./packages/${name}` });

  if (!rootTsConfig.compilerOptions.paths) {
    rootTsConfig.compilerOptions.paths = {};
  }
  rootTsConfig.compilerOptions.paths[packageName] = [`./packages/${name}/src`];

  fs.writeFileSync(rootTsConfigPath, JSON.stringify(rootTsConfig, null, 2));

  readline.close();
});
