var webpack = require("webpack");

module.exports = {
  entry: './demo.jsx',
  output: {
    publicPath: 'http://localhost:3000/assets',
    filename: 'facebook-login.js',
    path: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  externals: {
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
