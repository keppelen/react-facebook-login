var path = require('path');

module.exports = {
  entry: './demo/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.s[ac]ss$/i,
      use: [ "style-loader", "css-loader", "sass-loader" ],
    }]
  },
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'demo'),
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    contentBase: './demo'
  }
};
