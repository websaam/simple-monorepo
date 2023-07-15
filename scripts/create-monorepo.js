#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2] || "my-monorepo";

const templatePath = path.join(__dirname, "../");
const destinationPath = path.resolve(process.cwd(), projectName);

console.log(`Creating monorepo at ${destinationPath}`);

try {
  fs.copySync(templatePath, destinationPath);
  console.log("Monorepo created successfully!");

  // Change directory to the newly created monorepo
  process.chdir(destinationPath);

  // Update package.json to mark it as private
  const packageJsonPath = path.join(destinationPath, "package.json");
  const packageJson = require(packageJsonPath);
  packageJson.private = true;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Install dependencies
  console.log("Installing dependencies...");
  execSync("yarn install", { stdio: "inherit" });

  console.log("Done!");
} catch (err) {
  console.error("Error creating monorepo:", err);
  process.exit(1);
}
