var webpack = require('webpack');

module.exports = {
  output: {
    filename: 'src/main.js',
    publicPath: '/assets/'
  },
  cache: true,
  debug: true,
  devtool: '#cheap-modules-source-map'
  entry: [
      'webpack/hot/only-dev-server',
      './src/components/ReactGalleryApp.js'
  ],

  stats: {
    colors: true,
    reasons: true
  },
  //模块解析配置项;
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': __dirname + '/src'
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
      loader: 'react-hot!babel-loader'
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!sass-loader?outputStyle=expanded'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    },{
      test: /\.(png|jpg|woff|woff2|eot|svg|ttf)$/,
      loader: 'url-loader?limit=8192'
    }]
  },

  plugins: [
     new webpack.HotModuleReplacementPlugin()
  ]

};
