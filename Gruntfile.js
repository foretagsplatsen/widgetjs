module.exports = function(grunt) {

	// read almond from disk
	var fs = require('fs');
	var almondPath = require.resolve('almond').replace('.js', '');
	var almond = String(fs.readFileSync(almondPath + '.js'));

	// create wrapper
	var wrap = {
		start:
		"(function (root, factory) {" +
			"if (typeof define === 'function' && define.amd) {" +
			" define(['jquery', 'objectjs'], factory);" +
			" } else {" +
			" root.widgetjs = factory(root.$, root.objectjs);"+
			" } " +
			"}(this, function ($, objectjs) {" + almond,

		end:
		"define('jquery', function () {" +
			"   return $;" +
			"});" +
			"define('objectjs', function () {" +
			"   return objectjs;" +
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
						"jquery": "../bower_components/jquery/dist/jquery",
						"objectjs": "../bower_components/objectjs/dist/objectjs"
					},
					include: ["core"],
					exclude: ['jquery', 'objectjs'],
					out: './dist/<%= pkg.name %>.min.js',
					//optimize: "none", //'hybrid',
					wrap : wrap
				}
			}
		},
		jshint: {
			src: ['src/**/*.js'],
			test: ['test/**/*.js'],
			sample: ['sample/**/*.js', '!sample/converter/htmlparser.js']
		},
        mocha: {
            test: {
                src: ['test/**/*.html'],
                options: {
                    reporter: 'Spec'
                }
            },
            xunit: {
                src: ['test/**/*.html'],
                reporter: 'XUnit',
                dest: './dist/xunit.out'
            },
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
	grunt.loadNpmTasks('grunt-mocha');
	//grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'test']);
	grunt.registerTask('dist', ['default', 'requirejs', 'docco']);

	// Test task
	grunt.registerTask('test', 'mocha:test');
};
