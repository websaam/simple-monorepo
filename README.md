# TypeScript Monorepo

This is a simple, yet powerful monorepo for TypeScript packages. It doesn't rely on any monorepo-specific libraries and uses TypeScript's project references feature to handle inter-package dependencies.

## 📦 Package Structure

Each package resides in its own directory under the `packages/` directory. Each package has its own `package.json` and `tsconfig.json` files.

The `package.json` file includes the package's dependencies and scripts. The `main` field points to the CommonJS build, the `types` field points to the TypeScript declaration file of the CommonJS build, and the `browser` field points to the UMD build.

The `tsconfig.json` file extends the root `tsconfig.json` file and includes the `compilerOptions.outDir` option to specify the output directory for the TypeScript compiler.

## 🛠️ Scripts

| Script                   | Description                                                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn build`             | Compiles all TypeScript packages to CommonJS modules using the TypeScript compiler.                                                                |
| `yarn build:cjs`         | Compiles TypeScript packages to CommonJS modules using the TypeScript compiler.                                                                    |
| `yarn build:umd`         | Builds UMD bundles for each package using esBuild.                                                                                                 |
| `yarn build:esm`         | Builds ESM modules for each package using esbuild.                                                                                                 |
| `yarn build:packageJson` | Updates the package.json files in each package based on inter-package dependencies and paths to built files.                                       |
| `yarn publish:package`   | Publishes a package to the npm registry.                                                                                                           |
| `yarn publish:test`      | Publishes a package using Yalc for local testing.                                                                                                  |
| `yarn create:package`    | Creates a new package. It prompts for the package name, then creates the package directory and files.                                              |
| `yarn delete:package`    | Deletes a package. It prompts for the package name, then deletes the package directory and removes the package from the root `tsconfig.json` file. |
| `yarn check:packages`    | Checks if each package is correctly configured in the root `tsconfig.json` and logs any errors.                                                    |
| `yarn bump`              | Bumps the version of a package. It prompts for the package name and version type (major, minor, or patch), then updates the package's version.     |
| `yarn clean`             | Deletes the `dist` directory in each package. Useful for cleaning up build outputs before building again.                                          |

## 🚀 Getting Started

1. Clone the repository: `git clone <repository-url>`.
2. Install dependencies: `yarn install`.

## 🧱 Using one package inside another

In a monorepo setup, it's common to have one package depend on another. The order in which you perform the setup steps is very important. Here's the correct sequence:

1. Declare the dependency: In the `package.json` file of the dependent package (e.g., `bar`), add a dependency to the package it depends on (e.g., `foo`):

```
"dependencies": {
  "foo": "*"
}
```

2. add a reference to the dependency in `tsconfig.json`: In the `tsconfig.json` file of the dependent package (e.g., `bar`), add a reference to the package it depends on (e.g., `foo`):

```
"references": [
  { "path": "../foo" }
]
```

This tells TypeScript that `bar` depends on `foo`, so TypeScript will build `foo` first when you build `bar`.

3. Import the dependency: In the TypeScript code of the dependent package, import the module it depends on using its package name:

```
import { foo } from 'foo';
```

4. Build the packages: When building your packages, ensure that you build the dependencies before the dependent packages. You can use the provided scripts to build all packages:

```
yarn build
```

This will ensure that the compiled files of the dependencies are available for the dependent packages.

5. Checking the configuration: To check if each package is correctly configured in the root `tsconfig.json`, you can use the provided script:

```
node scripts/check-packages.js
```

This script checks if each package in the packages directory is declared in both compilerOptions.paths and references in the root tsconfig.json. If a package is not declared in either of these, it logs an error message.
