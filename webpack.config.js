const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {

  devtool: isProd ? 'eval' : 'source-map',

  entry: {
    demo: ['webpack/hot/dev-server', './demo/index.js'],
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'css?modules&localIdentName=[local]!postcss!sass' },
    ],
  },

  output: {
    filename: 'demo/bundle.js',
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    contentBase: './demo',
  },
};
