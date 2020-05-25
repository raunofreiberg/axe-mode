const postcss = require('rollup-plugin-postcss');
const path = require('path');

module.exports = {
  rollup(config, options) {
    config.plugins = [postcss(), ...config.plugins];

    // To get code splitting to work, we need to set output.dir instead of
    // output.file, which is what TSDX does by default
    const { file, ...output } = config.output || {};
    config.output = {
      ...output,
      dir: path.join(__dirname, 'dist'),
    };

    return config;
  },
};
