module.exports = function (config) {
  var path = require("path")
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'pact'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('@pact-foundation/karma-pact'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeoutInterval: 30000
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/app'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    pact: [{
      cors: true,
      port: 1234,
      consumer: 'baWeb',
      provider: 'baApi',
      log: path.resolve(process.cwd(), "logs", "pact.log"),
      dir: path.resolve(process.cwd(), "./pacts")
    }],
    proxies: {
      '/api/sync/' : 'http://127.0.0.1:1234/api/sync/',
      '/api/auth/' : 'http://127.0.0.1:1234/api/auth/',
      '/assets/': '/base/src/assets/'
    },
    browserNoActivityTimeout: 60 * 60 * 1000
  });
};
