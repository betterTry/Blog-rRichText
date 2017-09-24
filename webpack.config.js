var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './src/main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  watch: true,
  // devtool: '#cheap-modules-source-map',
  devtool: 'inline-source-map',
  //模块解析配置项;
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.join(__dirname, './src'),
      'component': path.join(__dirname, './src/react/component')
    }
  },
  module: {
    // preLoaders: [{
    //   test: /\.(js|jsx)$/,
    //   exclude: /node_modules/,
    //   loader: 'eslint-loader'
    // }],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime']
        }
      }
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!sass-loader?outputStyle=expanded'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}'
    }, {
      test: /\.json$/,
      loader: 'json'
    },{
      test: /\.(png|jpg|woff|woff2|eot|svg|ttf)$/,
      loader: 'url-loader?limit=8192'
    }]
  },
};
