'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'eval',

  entry: {
    demo: ['webpack/hot/dev-server', './demo/index.js'],
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.scss$/, use: ['css-loader', 'sass-loader'] },
    ],
  },

  output: {
    filename: 'demo/bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    static: './demo',
  },
};
