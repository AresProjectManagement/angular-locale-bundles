// Generated on 2013-07-17 using generator-angular 0.3.0
'use strict';
var coveralls = require('coveralls');
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('bower.json'),
        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    'src/*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'src'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'src'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                'Gruntfile.js',
                'src/*.js'
            ]
        },
        concat: {
            options: {
                banner: ['/**! ',
                    ' * @license <%= pkg.name %> v<%= pkg.version %>',
                    ' * Copyright (c) 2013 <%= pkg.author %>. <%= pkg.homepage %>',
                    ' * License: <%= pkg.license %>',
                    ' */\n'].join('\n')
            },
            main: {
                src: [
                    'src/angular-locale-bundles.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: ['/**! ',
                    ' * @license <%= pkg.name %> v<%= pkg.version %>',
                    ' * Copyright (c) 2013 <%= pkg.author.name %>. <%= pkg.homepage %>',
                    ' * License: MIT',
                    ' */\n'].join('\n')
            },
            main: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [
                        '<%= concat.main.dest %>'
                    ]
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            debug: {
                configFile: 'karma.conf.js',
                singleRun: false,
                browsers: ['Chrome'],
                reporters: ['progress', 'junit']
            }
        },
        bumpup: ['package.json', 'bower.json']
    });

    grunt.registerTask('coveralls', function () {
        var matches = grunt.file.expand('reports/coverage/*/lcov.info');
        if (!matches || matches.length === 0) {
            grunt.log.write('No lcov found.');
            return;
        }
        var content = grunt.file.read(matches);
        coveralls.handleInput(content);
    });

    grunt.registerTask('bump', function (type) {
        type = type ? type : 'patch';
        grunt.task.run([
            'bumpup:' + type,
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('test-start', [
        'clean:server',
        'connect:test',
        'karma:debug:start'
    ]);

    grunt.registerTask('test-run', [
        'karma:debug:run'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'test',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
