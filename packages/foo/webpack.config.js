const path = require('path');
const baseConfig = require('../../webpack.config.base.js');

module.exports = {
  ...baseConfig,
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    ...baseConfig.output,
    path: path.resolve(__dirname, 'dist', 'umd'),
  },
};