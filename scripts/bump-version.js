const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to increment the version based on the selected type
function incrementVersion(version, type) {
  const versionArr = version.split(".");
  let major = parseInt(versionArr[0]);
  let minor = parseInt(versionArr[1]);
  let patch = parseInt(versionArr[2]);

  switch (type) {
    case "major":
      major++;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor++;
      patch = 0;
      break;
    case "patch":
      patch++;
      break;
    default:
      console.error("Invalid version type!");
      process.exit(1);
  }

  return `${major}.${minor}.${patch}`;
}

readline.question("Enter the package name: ", (packageName) => {
  const packageDir = path.resolve(__dirname, "..", "packages", packageName);
  const packageJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Package "${packageName}" does not exist!`);
    readline.close();
    return;
  }

  readline.question(
    "Enter the version type (major, minor, or patch): ",
    (versionType) => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      if (!packageJson.version) {
        console.error(`Invalid package.json format in "${packageName}"!`);
        readline.close();
        return;
      }

      const currentVersion = packageJson.version;
      const newVersion = incrementVersion(currentVersion, versionType);

      packageJson.version = newVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      console.log(
        `Version for package "${packageName}" updated from ${currentVersion} to ${newVersion}`
      );

      readline.close();
    }
  );
});
