var gulp = require('gulp');
var rename = require('gulp-rename');
var bowerFiles = require('gulp-bower-files');
var inject = require('gulp-inject');
var replace = require('gulp-replace');

module.exports = function(){
    return gulp.src('src/html/index.tpl')
        .pipe(inject(bowerFiles({read: false})))
        .pipe(rename('index.html'))
        .pipe(replace(/\/app\/libs\//g, 'libs/'))
        .pipe(gulp.dest('app/'));
};
