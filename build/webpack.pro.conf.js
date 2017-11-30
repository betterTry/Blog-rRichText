const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');

const webpackConfig = merge(baseConfig, {
  watch: false,
});

module.exports = webpackConfig;
