// scripts/publish-package.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Which package do you want to publish? ", (packageName) => {
  const packageDir = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "dist"
  );
  const packageJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Package ${packageName} does not exist in ${packageDir}`);
    process.exit(1);
  }

  // Run the publish command
  try {
    console.log(`Publishing package ${packageName} from ${packageDir}...`);
    execSync("npm publish --access=public", { cwd: packageDir, stdio: "inherit" });
    console.log(`Package ${packageName} has been published`);
  } catch (error) {
    console.error(
      `Failed to publish package ${packageName} from ${packageDir}`
    );
    console.error(error.message);
    process.exit(1);
  }

  rl.close();
});
