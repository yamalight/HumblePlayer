var gulp = require('./gulp')([
    'bootstrap',
    'bower',
    'browserify',
    'watch',
    'minifycss',
    'jshint',
    'inject',
]);

gulp.task('init', ['bower', 'bootstrap']);
gulp.task('build', ['inject', 'browserify', 'minifycss']);
gulp.task('test', ['jshint']);
gulp.task('default', ['build', 'watch']);
