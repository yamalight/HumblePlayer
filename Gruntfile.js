module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: './builds', // Where the build version of my node-webkit app is saved
                mac: true,
                win: false,
                linux32: false,
                linux64: false
            },
            src: ['./src/**/*'] // Your node-wekit app
        },

        // bower
        browserify: {
            js: {
                // A single entry point for our app
                src: 'src/js/index.js',
                // Compile to a single file to add a script tag for in your HTML
                dest: 'app/js/app.min.js',
                options: {
                    debug: grunt.option('debug'),
                    transform: ['debowerify', 'deamdify'],
                    postBundleCB: function (err, src, next) {
                        // HACK: save Node's `require` before it gets overrided by browserify
                        next(err, 'nodeRequire = require; ' + src);
                    }
                }
            },
        },

        // css compression
        cssmin: {
            build: {
                files: {
                    'app/css/main.min.css': [
                        'src/css/main.css',
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'bower_components/bootstrap/dist/css/bootstrap-theme.css'
                    ]
                }
            }
        },

        // copy fonts
        copy: {
            init: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/fonts/',
                src: '**',
                dest: 'app/fonts/',
            },
        },
    });

    // load extensions
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('init', 'Initializes app configs and libraries', ['bower']);
    grunt.registerTask('build-all', 'Builds and minimizes stuff', ['browserify', 'cssmin', 'copy']);
    grunt.registerTask('build', 'Builds and minimizes js', ['browserify']);
    grunt.registerTask('build-css', 'Builds and minimizes css', ['cssmin']);
    grunt.registerTask('deploy', ['nodewebkit']);
};