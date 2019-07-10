// Karma configuration
// Generated on Wed Mar 23 2016 10:24:46 GMT+0100 (CET)

var webpackConfig = require("./webpack.jasmine.config.js");

module.exports = function(config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "",

		// https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine"],

		// list of files / patterns to load in the browser
		files: [
			"src/test/tests.js",
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"src/test/**/*.js": ["webpack"]
		},

		webpack: webpackConfig,

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ["Electron"],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		browserNoActivityTimeout: 20000
	});
};
