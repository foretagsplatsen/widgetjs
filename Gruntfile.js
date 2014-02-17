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
        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                options: {
                    destination: 'docs/jsdoc',
					configure: 'jsdoc.conf'
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
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'test']);
	grunt.registerTask('dist', ['default', 'requirejs', 'jsdoc']);

	// Test task
	grunt.registerTask('test', 'mocha:test');
};
