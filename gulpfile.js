var gulp = require("gulp");
var Server = require("karma").Server;

var plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-eslint": "eslint"
	}
});

var sources = ["./src/**/*.js", "!src/test/"];
var misc = ["./gulpfile.js", "./eslintrc.js"];
var tests = ["./src/test/**/*.js"];
var all = sources.slice().concat(misc).concat(tests);

gulp.task("default", ["lint", "test"]);

// Lint

gulp.task("lint", ["lint:js"]);

gulp.task("lint:js", function() {
	return gulp.src(all)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format("unix"))
		.pipe(plugins.eslint.failAfterError());
});

// Test

gulp.task("test", function(done) {
	new Server({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true
	}, done).start();
});
