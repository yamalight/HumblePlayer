var gulp = require('gulp');

module.exports = function(){
    gulp.src('./bower_components/bootstrap/dist/fonts/**')
    .pipe(gulp.dest('./app/fonts/'));
};