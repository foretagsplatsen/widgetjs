var gulp = require("gulp");
var del = require("del");
var Server = require("karma").Server;
var fs = require("fs");

var plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-eslint": "eslint",
		"gulp-shell": "shell",
		"gulp-phantom": "phantom",
		"gulp-strip-code": "stripCode",
		"gulp-sequence": "sequence",
		"gulp-requirejs-optimize": "optimizer",
		"gulp-bump": "bump"
	}
});

var almond = fs.readFileSync(__dirname + "/node_modules/almond/almond.js");

var wrap = {
	start: "(function(root, factory) {\n" +
	"    if (typeof define === \"function\" && define.amd) {\n" +
	"        define(\"widgetjs\", [\"jquery\", \"klassified\"], factory);\n" +
	"    } else {\n" +
	"        root.widgetjs = factory(root.$, root.klassified);\n" +
	"    }\n" +
	"}(this, function($, klassified) {\n" +
	almond + "\n" +
	"    define('jquery', function() { return $; })\n" +
	"    define('klassified', function() { return klassified; })\n",
	end: "    return require(\"widgetjs\");\n" +
	"}));"
};

var sources = ["./src/**/*.js"];
var misc = ["./gulpfile.js", "./eslintrc.js"];
var tests = ["./test/**/*.js"];
var all = sources.slice().concat(misc).concat(tests);

gulp.task("default", ["test"]);

// Lint

gulp.task("lint", ["js-lint"]);

gulp.task("js-lint", function() {
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

//
// Deploy
//

gulp.task("strip", function() {
	return gulp.src(sources)
		.pipe(plugins.stripCode({
			start_comment: "start-test",
			end_comment: "end-test"
		}))
		.pipe(gulp.dest("strip/src"));
});

var requireJSOptions = {
	mainConfigFile: "./config.js",
	wrap: wrap,
	paths: {
		"jquery": "../bower_components/requirejs/require",
		"klassified": "../bower_components/klassified/src/object"
	},
	findNestedDependencies: true
};

gulp.task("optimize", ["strip"], function() {
	var options = Object.assign(requireJSOptions);
	options.baseUrl = "strip";
	options.optimize = "none";
	options.include = ["src/widgetjs"];
	options.exclude = ["jquery", "klassified"];
	options.insertRequire = ["src/widgetjs"];
	options.out = "widgetjs.js";

	return gulp.src("strip/src/widgetjs.js")
		.pipe(plugins.optimizer(options))
		.pipe(gulp.dest("dist"));
});

gulp.task("optimize:minify", ["strip"], function() {
	var options = Object.assign(requireJSOptions);
	delete options.optimize;
	options.baseUrl = "strip";
	options.include = ["src/widgetjs"];
	options.exclude = ["jquery", "klassified"];
	options.insertRequire = ["src/widgetjs"];
	options.out = "widgetjs.min.js";

	return gulp.src("strip/widgetjs.js")
		.pipe(plugins.optimizer(options))
		.pipe(gulp.dest("dist"));
});

gulp.task("build", plugins.sequence(
	"optimize",
	"optimize:minify",
	"clean:strip"
));

//
// Release
//

gulp.task("bump:patch", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({type: "patch"}))
		.pipe(gulp.dest("./"));
});

gulp.task("bump:minor", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({type: "minor"}))
		.pipe(gulp.dest("./"));
});

gulp.task("bump:major", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({type: "major"}))
		.pipe(gulp.dest("./"));
});

gulp.task("release:patch", ["bump:patch", "build"], function() {});
gulp.task("release:minor", ["bump:minor", "build"], function() {});
gulp.task("release:major", ["bump:major", "build"], function() {});

//
// Clean
//

gulp.task("clean:strip", function(cb) {
	del([
		"strip"
	], cb);
});

gulp.task("clean:build", function(cb) {
	del([
		"dist"
	], cb);
});

gulp.task("clean", plugins.sequence([
	"clean:build",
	"clean:strip"
]));
