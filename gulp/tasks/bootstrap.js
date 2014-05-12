var gulp = require('gulp');

module.exports = function(){
    gulp.src('./app/libs/bootstrap/dist/fonts/**')
    .pipe(gulp.dest('./app/fonts/'));
};
