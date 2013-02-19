module.exports = function(grunt) {

  // code to wrap around the start / end of the resulting build file
  // the global variable used to expose the API is defined here
  var wrap = {
    start: "(function(global, define) {\n" +
              // check for amd loader on global namespace
           "  var globalDefine = global.define;\n",

    end:   "  var library = require('widgetjs');\n" +
           "  if(typeof module !== 'undefined' && module.exports) {\n" +
                // export library for node
           "    module.exports = library;\n" +
           "  } else if(globalDefine) {\n" +
                // define library for global amd loader that is already present
           "    (function (define) {\n" +
           "      define(function () { return library; });\n" +
           "    }(globalDefine));\n" +
           "  } else {\n" +
                // define library on global namespace for inline script loading
           "    global['widgetjs'] = library;\n" +
           "  }\n" +
           "}(this));\n"
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      std: {
        options: {
          baseUrl: './src/',
          include: ["core"],
          paths: {
            "jquery": "../components/requirejs/require"
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
  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('dist', ['default', 'requirejs']);
};