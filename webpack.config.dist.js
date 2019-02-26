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
    filename: 'facebook-auth-[name].js',
    libraryTarget: 'umd',
    library: 'FacebookLogin',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
        sourceMap: true,
      }),
    ],
  },
};
