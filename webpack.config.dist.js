const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: ['./src/facebook.js'],
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            loader: require.resolve('babel-loader'),
            exclude: /node_modules/,
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'sass-loader',
              },
            ],
            exclude: /node_modules/,
          },
        ],
      },
    ],
  },

  externals: {
    react: 'react',
    'react-dom': 'ReactDOM',
  },

  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactFacebookAuthenticate',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
