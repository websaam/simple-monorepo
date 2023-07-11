const fs = require("fs");
const path = require("path");

const packagesDir = path.resolve(__dirname, "..", "packages");
const packageDirs = fs.readdirSync(packagesDir);

const configurations = packageDirs.map((dir) => {
  const entryPath = path.resolve(packagesDir, dir, "src/index.ts");
  if (fs.existsSync(entryPath)) {
    return `{
      entry: {
        ${dir}: '${entryPath}'
      },
      output: {
        path: path.resolve(__dirname, 'packages', '${dir}', 'dist', 'umd'),
        filename: 'index.js',
        library: '${dir}',
        libraryTarget: 'umd',
        globalObject: 'this',
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    }`;
  }
  return "";
});

const webpackConfigContent = `const path = require('path');

module.exports = [
  ${configurations.join(",\n")}
];`;

fs.writeFileSync(
  path.resolve(__dirname, "..", "webpack.config.js"),
  webpackConfigContent
);
