'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-testem');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['target/build/js/Globals.js', 'target/build/js/Event.js', 'target/build/js/Level.js', 'target/build/js/Formatter.js', 'target/build/js/Logging.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['target/build/js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        coffee: {
            build: {
                expand: true,
                cwd: 'src/coffee',
                src: ['*.coffee'],
                dest: 'target/build/js',
                ext: '.js'
            },
            test: {
                expand: true,
                cwd: 'test/coffee',
                src: ['*.coffee'],
                dest: 'target/test/js',
                ext: '.js'
            }
        },
        watch: {
            karma: {
                files: ['test/coffee/*.coffee'],
                tasks: ['coffee:test','karma:unit:run'] //NOTE the :run flag
            },
            coffee: {
                files: ['src/coffee/*.coffee'],
                tasks: ['coffee:build']
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: true
            }
        },
        livereload: {},
        clean: {
            build: 'target'
        }

    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('develop', [
        'clean:build',
        'coffee:build',
        'livereload-start',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:build',
        'coffee:build',
        'coffee:test',
        'karma:unit',
        'watch:karma'

    ]);

    grunt.registerTask('build', [
        'clean:build',
        'coffee:build',
        'concat:dist'
    ]);

    grunt.registerTask('default', ['build']);

};