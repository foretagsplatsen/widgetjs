const {src, task, series} = require("gulp");
const eslint = require("gulp-eslint");

var Server = require("karma").Server;

var sources = ["./src/**/*.js", "!src/test/"];
var misc = ["./gulpfile.js", "./.eslintrc.js"];
var tests = ["./src/test/**/*.js"];
var all = sources.slice().concat(misc).concat(tests);

// Lint

task("lint:js", () => {
	return src(all)
		.pipe(eslint())
		.pipe(eslint.format("unix"))
		.pipe(eslint.failAfterError());
});

task("lint", series("lint:js"));

// Test

task("test", (done) => {
	new Server({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true
	}, done).start();
});

task("default", series("lint", "test"));
