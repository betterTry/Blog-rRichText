const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = merge(baseConfig, {
  watch: false,
  output: {
    filename: '[name].js',
    // chunkFilename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return (
          module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      },
    }),
    // 防止生成的hash变化;
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin('public/css/page/bundle.css'),
  ],
});

module.exports = webpackConfig;
