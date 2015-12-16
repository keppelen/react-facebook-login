'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    demo: ['./src/index.js']
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=0&loose=all', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'css?modules&localIdentName=[local]!postcss!sass'}
    ]
  },

  externals: {
    'react': 'react',
    'react-dom': 'ReactDOM',
  },

  output: {
    filename: 'dist/facebook-login.js',
    libraryTarget: 'umd',
    library: 'FacebookLogin'
  },


  resolve: {
    extensions: ['', '.js']
  },

  plugins: [
    new webpack.optimize.DedupePlugin()
  ]
};
