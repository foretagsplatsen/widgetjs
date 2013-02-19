module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      std: {
        options: {
          baseUrl: './src/',
          include: ["main"],
          paths: {
            "jquery": "../vendor/require-jquery"
          },
          out: './dist/<%= pkg.name %>.min.js'
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        nomen: true,
        globals: {
          define: true,
          jQuery: true
        }
      },
      all: ['src/**/*.js']
    },
    qunit: {
      all: ['test/**/*.html']
    },
    watch: {
      files: ['<%= jshint.all %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('dist', ['default', 'requirejs']);
};