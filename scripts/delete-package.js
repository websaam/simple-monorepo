const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Which package do you want to delete? ", (packageName) => {
  const packageDir = path.resolve(__dirname, "..", "packages", packageName);

  if (!fs.existsSync(packageDir)) {
    console.error(`Package "${packageName}" does not exist.`);
    readline.close();
    return;
  }

  readline.question(
    `Are you sure you want to delete package "${packageName}"? (yes/no) `,
    (answer) => {
      if (answer.toLowerCase() !== "yes") {
        console.log("Aborted");
        readline.close();
        return;
      }

      fs.rmdirSync(packageDir, { recursive: true });
      console.log(`Deleted package "${packageName}"`);

      const rootTsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
      const rootTsConfig = JSON.parse(
        fs.readFileSync(rootTsConfigPath, "utf8")
      );
      rootTsConfig.references = rootTsConfig.references.filter(
        (ref) => ref.path !== `./packages/${packageName}`
      );

      // Remove the package from compilerOptions.paths
      if (rootTsConfig.compilerOptions.paths) {
        delete rootTsConfig.compilerOptions.paths[packageName];
      }

      fs.writeFileSync(rootTsConfigPath, JSON.stringify(rootTsConfig, null, 2));

      console.log(`Removed package "${packageName}" from tsconfig.json`);

      readline.close();
    }
  );
});
