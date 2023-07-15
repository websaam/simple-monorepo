#!/usr/bin/env node

const yargs = require("yargs");

yargs
  .command("build", "Build the project", {}, () => {
    // Execute the build command
    runCommand("build");
  })
  .command("publish:package", "Publish a package", {}, () => {
    // Execute the publish:package command
    runCommand("publish:package");
  })
  .command("publish:test", "Publish a package for testing", {}, () => {
    // Execute the publish:test command
    runCommand("publish:test");
  })
  .command("create:package", "Create a new package", {}, () => {
    // Execute the create:package command
    runCommand("create:package");
  })
  .command("delete:package", "Delete a package", {}, () => {
    // Execute the delete:package command
    runCommand("delete:package");
  })
  .command("check:packages", "Check packages", {}, () => {
    // Execute the check:packages command
    runCommand("check:packages");
  })
  .command("bump", "Bump the version", {}, () => {
    // Execute the bump command
    runCommand("bump");
  })
  .command("clean", "Clean the project", {}, () => {
    // Execute the clean command
    runCommand("clean");
  })
  .command("test", "Run tests", {}, () => {
    // Execute the test command
    runCommand("test");
  })
  .demandCommand()
  .help().argv;

function runCommand(command) {
  const { spawnSync } = require("child_process");
  const result = spawnSync("yarn", [command], { stdio: "inherit" });
  if (result.error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
  process.exit(result.status);
}
