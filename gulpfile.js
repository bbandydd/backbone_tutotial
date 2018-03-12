const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      inject = require('gulp-inject'),
      concat = require('gulp-concat'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify');

gulp.task('server', function() {
    browserSync.init({
        files: ['app/*.html', 'app/js/*.js'],
        server: 'dist',
    });

    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('app/*.html', ['html']);
});

gulp.task('css', function() {
    gulp.src('app/css/*.*')
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('lib', function() {
    gulp.src('app/lib/*.*')
    .pipe(gulp.dest('dist/lib'));
})

gulp.task('js', function() {
    gulp.src('app/js/*.*')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
    const sources = gulp.src([
        'app/lib/*.*',
        'app/css/*.*',
        'app/js/*.*'
    ], {read: false});

    gulp.src('app/index.html')
        .pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['lib', 'js', 'css', 'html', 'server']);