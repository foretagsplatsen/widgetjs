module.exports = function(grunt) {

	// read almond from disk
	var fs = require('fs');
	var almondPath = require.resolve('almond').replace('.js', '');
	var almond  = String(fs.readFileSync(almondPath + '.js'));

	// create wrapper
	var wrap = {
		start:
		"(function (root, factory) {" +
			"if (typeof define === 'function' && define.amd) {" +
			" define(['jquery'], factory);" +
			" } else {" +
			" root.widgetjs = factory(root.$);"+
			" } " +
			"}(this, function ($) {" + almond,

		end:
		"define('jquery', function () {" +
			"   return $;" +
			"});" +
			"return require('core');" +
			"}));"
	};

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			std: {
				options: {
					//almond: true,
					baseUrl: './src/',
					paths: {
						"jquery": "../bower_components/requirejs/require"
					},
					include: ["core"],
					exclude: ['jquery'],
					out: './dist/<%= pkg.name %>.min.js',
					//optimize: "none", //'hybrid',
					wrap : wrap
				}
			}
		},
		jshint: {
			src: ['src/**/*.js'],
			test: ['test/**/*.js'],
			sample: ['sample/**/*.js']
		},
		qunit: {
			all: ['test/**/*.html']
		},
		docco: {
			src: {
				src: ['src/**/*.js'],
				options: {
					output: 'docs/docco/'
				}
			}
		},
		watch: {
			files: ['<%= jshint.src %>', '<%= jshint.test %>', '<%= jshint.sample %>'],
			tasks: ['jshint:src', 'qunit']
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	//grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'qunit']);
	grunt.registerTask('dist', ['default', 'requirejs', 'docco']);

	// Test task
	grunt.registerTask('test', 'qunit');
};
