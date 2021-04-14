var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'with-button': ['./src/facebook-with-button.js'],
    'render-props': ['./src/facebook.js'],
  },

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

  externals: {
    'react': 'react',
    'react-dom': 'ReactDOM',
  },

  output: {
    filename: 'facebook-login-[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'FacebookLogin',
  },

  resolve: {
    extensions: ['.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
};
