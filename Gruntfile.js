module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {});

    grunt.initConfig({
        site: {
            app: 'app',
            dist: 'dist'
        },

        clean: {
            server: {
                files: [
                    {
                        dot: true,
                        src: '<%= site.dist %>/*'
                    }
                ]
            }
        },

        jekyll: {
            options: {
                bundleExec: true,
                config: '_config.yml',
                dest: '<%= site.dist %>',
                src: '<%= site.app %>'
            },
            build: {
                options: {
                    config: '_config.yml,_config.build.yml'
                }
            },
            server: {
                options: {
                    src: '<%= site.app %>'
                }
            },
            check: {
                options: {
                    doctor: true
                }
            }
        },

        copy: {
            server: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= site.app %>',
                        src: [
                            'img/**/*'
                        ],
                        dest: '<%= site.dist %>'
                    }
                ]
            }
        },

        less: {
            options: {
                compress: true
            },
            build: {},
            server: {
                options: {
                    compress: false,
                    sourceMap: true
                },
                files: {
                    '<%= site.dist %>/css/core.css': '<%= site.app %>/_less/core.less'
                }
            },
            test: {}
        },

        postcss: {
            build: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}),
                        require('cssnano')()
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= site.dist %>/css',
                        src: '**/*.css',
                        dest: '<%= site.dist %>/css'
                    }
                ]
            }
        },

        connect: {
            options: {
                hostname: '0.0.0.0',
                port: 9047,
                middleware: function (connect, options, middlewares) {
                    middlewares.unshift(function (request, response, next) {
                        response.setHeader('Access-Control-Allow-Origin', '*');
                        response.setHeader('Access-Control-Allow-Methods', '*');
                        return next();
                    });
                    return middlewares;
                },
                useAvailablePort: true
            },
            local: {
                options: {
                    base: '<%= site.dist %>'
                }
            }
        },

        watch: {
            gruntfile: {
              files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            images: {
                files: ['<%= site.app %>/img/**/*.*'],
                tasks: ['copy:server']
            },
            less: {
                files: ['<%= site.app %>/_less/**/*.less'],
                tasks: ['less:server']
            },
            javascript: {
                files: ['<%= site.app %>/_js/**/*.js'],
                tasks: ['concat']
            },
            jekyll: {
                files: [
                    '_*.*',
                    '<%= site.app %>/**/*.{xml,html,yml,md,mkd,markdown,txt}'
                ],
                tasks: ['jekyll:server', 'concurrent']
            }
        },

        concat: {
            options: {
                sourceMap: true,
                separator: grunt.util.linefeed + ';'
            },
            server: {
                files: [
                    {
                        src: [
                            '<%= site.app %>/_js/controllers/**/*.js',
                            '<%= site.app %>/_js/models/**/*.js',
                            '<%= site.app %>/_js/views/**/*.js',
                            '<%= site.app %>/_js/main.js'
                        ],
                        dest: '<%= site.dist %>/js/core.js'
                    }
                ]
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                check: 'gzip'
            },
            build: {
                files: {
                    '<%= site.dist %>/js/core.js': '<%= site.dist %>/js/core.js'
                }
            }
        },

        concurrent: {
            server: [
                'copy:server',
                'less:server',
                'concat'
            ]
        }
    });

    grunt.registerTask('dev', [
        'clean:server',
        'jekyll:server',
        'concurrent:server',
        'watch'
    ]);

    grunt.registerTask('server', [
        'clean:server',
        'jekyll:server',
        'concurrent:server',
        'connect',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:server',
        'jekyll:build',
        'concurrent:server',
        'postcss:build'
    ]);

    grunt.registerTask('test', [
        'jekyll:check'
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);
};
