# TypeScript Monorepo

This is a simple, yet powerful monorepo for TypeScript packages. It doesn't rely on any monorepo-specific libraries and uses TypeScript's project references feature to handle inter-package dependencies.

## 📦 Package Structure

Each package resides in its own directory under the `packages/` directory. Each package has its own `package.json` and `tsconfig.json` files.

The `package.json` file includes the package's dependencies and scripts. The `main` field points to the CommonJS build, the `types` field points to the TypeScript declaration file of the CommonJS build, and the `browser` field points to the UMD build.

The `tsconfig.json` file extends the root `tsconfig.json` file and includes the `compilerOptions.outDir` option to specify the output directory for the TypeScript compiler.

## 🛠️ Scripts

| Script                | Description                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn build`          | Compiles all TypeScript packages to CommonJS modules using the TypeScript compiler.                                                                |
| `yarn build:umd`      | Builds UMD bundles for each package using Webpack.                                                                                                 |
| `yarn create:package` | Creates a new package. It prompts for the package name, then creates the package directory and files.                                              |
| `yarn delete:package` | Deletes a package. It prompts for the package name, then deletes the package directory and removes the package from the root `tsconfig.json` file. |
| `yarn clean`          | Deletes the `dist` directory in each package. Useful for cleaning up build outputs before building again.                                          |

## 🚀 Getting Started

1. Clone the repository: `git clone <repository-url>`.
2. Install dependencies: `yarn install`.

## 🆕 Creating a New Package

Run `yarn create:package` and enter the package name when prompted. This will create a new package with a `package.json` file, a `tsconfig.json` file, and a `src/index.ts` file.

After creating a new package, remember to run `yarn build` and `yarn build:umd` to generate the CommonJS and UMD bundles, respectively.

## 🗑️ Deleting a Package

Run `yarn delete:package` and enter the package name when prompted. This will delete the package and remove it from the root `tsconfig.json` file.

## 🏗️ Building Packages

Run `yarn build` to compile all TypeScript packages to CommonJS modules using the TypeScript compiler. The compiled JavaScript files will be output to the `./dist/cjs` directory in each package.

Run `yarn build:umd` to build UMD bundles for each package using Webpack. The bundles will be output to the `./dist/umd` directory in each package.

## 🧹 Cleaning Build Outputs

Run `yarn clean` to delete the `dist` directory in each package. This is useful for cleaning up build outputs before building again.
