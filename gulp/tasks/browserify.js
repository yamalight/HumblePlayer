var gulp = require('gulp');
var browserify = require('gulp-browserify');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

module.exports = function() {
    return gulp.src('./src/js/index.js')
        .pipe(browserify())
        .pipe(uglify({mangle: false}))
        .pipe(header('nodeRequire = require; '))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./app/dist/'));
};
