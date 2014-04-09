var gulp = require('./gulp')([
    'bootstrap',
    'bower',
    'browserify',
    'watch',
    'minifycss',
    'jshint',
]);

gulp.task('init', ['bower', 'bootstrap']);
gulp.task('build', ['browserify', 'minifycss']);
gulp.task('test', ['jshint']);
gulp.task('default', ['build', 'watch']);