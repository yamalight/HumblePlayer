var gulp = require('gulp');
var browserify = require('gulp-browserify');
var header = require('gulp-header');
var rename = require('gulp-rename');

module.exports = function() {
    return gulp.src('./src/js/index.js')
        .pipe(browserify({
            transform: ['debowerify', 'deamdify'],
        }))
        .pipe(header('nodeRequire = require; '))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./app/js/'));
};