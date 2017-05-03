/* global jasmine */

// Jasmine configuration options
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;

require(["./tests"], function(options) {
	var config = options.config;
	config.baseUrl = "../";
	require.config(config);

	require(options.files, function(files) {
		jasmine.getEnv().execute();
	});
});
