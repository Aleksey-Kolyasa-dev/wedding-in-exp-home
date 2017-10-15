"use strict";
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const remember = require('gulp-remember');
const imagemin = require('gulp-imagemin');
/*const minify = require('gulp-minify');*/
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Clean PUBLIC
gulp.task('clean', function () {
   return del('public');
});

// Copy HTML from FRONTEND
gulp.task('copyHTML', function () {
    return gulp.src('frontend/**/*.html', { since : gulp.lastRun('copyHTML')})
        .pipe(newer('public'))
        .pipe(gulp.dest('public'));
});

// Copy CSS from FRONTEND
gulp.task('copyCSS', function () {
    return gulp.src('frontend/**/*.css', { since : gulp.lastRun('copyCSS')})
        .pipe(newer('public'))
        .pipe(debug())
        .pipe(autoprefixer())
        .pipe(remember('copyCSS'))
        .pipe(gulp.dest('public'));
});

// Copy JS from FRONTEND
gulp.task('copyJS', function () {
    return gulp.src('frontend/js/**/*.js', { since : gulp.lastRun('copyJS')})
        .pipe(newer('public'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(debug())
        .pipe(gulp.dest('public/js'));
});

// Copy lib JS from FRONTEND
gulp.task('copyLibsJS', function () {
    return gulp.src('frontend/libs/js/**/*.js', { since : gulp.lastRun('copyLibsJS')})
        .pipe(newer('public'))
        .pipe(uglify())
        .pipe(debug())
        .pipe(gulp.dest('public/libs/js'));
});

// Copy IMG from FRONTEND
gulp.task('copyIMG', function () {
    return gulp.src('frontend/img/**/*.{png,jpg}', { since : gulp.lastRun('copyIMG')})
        .pipe(newer('public'))
        .pipe(imagemin())
        .pipe(remember())
        .pipe(gulp.dest('public/img'));
});

// Copy FONTS PB from FRONTEND
gulp.task('copyFONTS-PB', function () {
    return gulp.src('frontend/img/fonts/**/*.*', { since : gulp.lastRun('copyFONTS-PB')})
        .pipe(newer('public'))
        .pipe(gulp.dest('public/img/fonts'));
});

// Copy FONTS GLF from FRONTEND
gulp.task('copyFONTS-GLF', function () {
    return gulp.src('frontend/libs/fonts/**/*.*', { since : gulp.lastRun('copyFONTS-GLF')})
        .pipe(newer('public'))
        .pipe(gulp.dest('public/libs/fonts'));
});

// Copy JS from FRONTEND
gulp.task('copyFVICO', function () {
    return gulp.src('frontend/*.ico', { since : gulp.lastRun('copyFVICO')})
        .pipe(newer('public'))
        .pipe(gulp.dest('public'));
});

// ASSEMBLER COPY TASK
gulp.task('copy', gulp.series('copyHTML', 'copyCSS', 'copyJS', 'copyLibsJS', 'copyIMG', 'copyFONTS-PB', 'copyFONTS-GLF', 'copyFVICO'));

// "WATCH" Fn
gulp.task('watch', function () {
    gulp.watch('frontend/**/*.*', gulp.series('copy'));
});
// BROWSER-SYNC config
gulp.task('serve', function () {
    browserSync.init({
        proxy : 'http://localhost/',
        port : 81
    });
   browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});
/*
* *READY
* */

// build PRODUCTION
gulp.task('prod', gulp.series('clean', 'copy'));

// build DEV & WATCH & BROWSER-SYNC
gulp.task('default', gulp.series('clean','copy', gulp.parallel('watch', 'serve')));
