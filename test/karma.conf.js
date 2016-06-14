var webpackConfig = require('../webpack.config.js');

webpackConfig.externals = undefined;
webpackConfig.output.library = undefined;
webpackConfig.output.libraryTarget = undefined;

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'phantomjs-shim'],

    files: [
      '**/*-spec.js'
    ],

    exclude: [
    ],

    preprocessors: {
      '**/*-spec.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['spec'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS', 'Chrome'],

    singleRun: !process.env.DEV
  })
}
