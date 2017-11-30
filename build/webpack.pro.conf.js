const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');

const webpackConfig = merge(baseConfig, {
  watch: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
      },
    }),
  ],
});

module.exports = webpackConfig;