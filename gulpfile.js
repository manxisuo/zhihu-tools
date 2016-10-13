let gulp = require('gulp');
let babel = require('gulp-babel');

gulp.task('default', () => {
    console.log('default');
});

gulp.task('babel', () => {
    gulp.src('./js/*.js')
        .pipe(babel({
            presets: ['es2017']
        }))
        .pipe(gulp.dest('./build'));
});