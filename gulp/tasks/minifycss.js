var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');

module.exports = function() {
    gulp.src([
        './src/css/*.css',
        './app/libs/bootstrap/dist/css/bootstrap.css',
        './app/libs/bootstrap/dist/css/bootstrap-theme.css',
        './app/libs/ladda/dist/ladda-themeless.min.css',
    ])
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./app/dist/'));
};
