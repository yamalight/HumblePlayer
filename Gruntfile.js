module.exports = function(grunt) {

    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: './build', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: false, // We don't need linux64
            },
            src: './app/**/*' // Your node-webkit app
        },

        copy: {
            main: {
                files: [{
                    src: 'libraries/win/ffmpegsumo.dll',
                    dest: 'build/releases/HumblePlayer/win/HumblePlayer/ffmpegsumo.dll',
                    flatten: true
                }, {
                    src: 'libraries/mac/ffmpegsumo.so',
                    dest: 'build/releases/HumblePlayer/mac/HumblePlayer.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
                    flatten: true
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['nodewebkit', 'copy']);

};
