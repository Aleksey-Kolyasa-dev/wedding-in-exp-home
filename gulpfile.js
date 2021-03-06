"use strict";

// "devDependencies": {
// 	"del": "^3.0.0",
// 		"gulp": "github:gulpjs/gulp#4.0",
// 		"gulp-autoprefixer": "^4.0.0",
// 		"gulp-clean-css": "^3.9.0",
// 		"gulp-debug": "^3.1.0",
// 		"gulp-htmlmin": "^3.0.0",
// 		"gulp-if": "^2.0.2",
// 		"gulp-imagemin": "^3.4.0",
// 		"gulp-newer": "^1.3.0",
// 		"gulp-ng-annotate": "^2.0.0",
// 		"gulp-remember": "^0.3.1",
// 		"gulp-remove-html-comments": "^1.0.1",
// 		"gulp-sourcemaps": "^2.6.1",
// 		"gulp-uglify": "^3.0.0"
// },

// const gulp = require('gulp');
// //const sourcemaps = require('gulp-sourcemaps');
// const debug = require('gulp-debug');
// //const gulpIf = require('gulp-if');
// const newer = require('gulp-newer');
// const autoprefixer = require('gulp-autoprefixer');
// const remember = require('gulp-remember');
// const imagemin = require('gulp-imagemin');
// const ngAnnotate = require('gulp-ng-annotate');
// const uglify = require('gulp-uglify');
// const cleanCSS = require('gulp-clean-css');
// const removeHtmlComments = require('gulp-remove-html-comments');
// const htmlmin = require('gulp-htmlmin');
// const del = require('del');
// const browserSync = require('browser-sync').create();
//
//
// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
//
// // Clean PUBLIC
// gulp.task('clean', function () {
//    return del('public');
// });
//
// // Copy HTML from FRONTEND
// gulp.task('copyHTML', function () {
//     return gulp.src('frontend/**/*.html', { since : gulp.lastRun('copyHTML')})
//         .pipe(newer('public'))
//         .pipe(removeHtmlComments())
//         .pipe(htmlmin({collapseWhitespace: true}))
//         .pipe(gulp.dest('public'));
// });
//
// // Copy CSS from FRONTEND
// gulp.task('copyCSS', function () {
//     return gulp.src('frontend/css/**/*.css', { since : gulp.lastRun('copyCSS')})
//         .pipe(newer('public'))
//         //.pipe(debug())
//         .pipe(autoprefixer())
//         .pipe(remember('copyCSS'))
//         .pipe(cleanCSS({rebase: false}))
//         .pipe(gulp.dest('public/css'));
// });
//
// // Copy CSS from FRONTEND
// gulp.task('copyLibsCSS', function () {
//     return gulp.src('frontend/libs/css/**/*.css', { since : gulp.lastRun('copyLibsCSS')})
//         .pipe(newer('public'))
//         .pipe(remember('copyLibsCSS'))
//         .pipe(cleanCSS({rebase: false}))
//         .pipe(gulp.dest('public/libs/css'));
// });
//
// // Copy JS from FRONTEND
// gulp.task('copyJS', function () {
//     return gulp.src('frontend/js/**/*.js', { since : gulp.lastRun('copyJS')})
//         .pipe(newer('public'))
//         .pipe(ngAnnotate())
//         .pipe(uglify())
//         //.pipe(debug())
//         .pipe(gulp.dest('public/js'));
// });
//
// // Copy lib JS from FRONTEND
// gulp.task('copyLibsJS', function () {
//     return gulp.src('frontend/libs/js/**/*.js', { since : gulp.lastRun('copyLibsJS')})
//         .pipe(newer('public'))
//         .pipe(uglify())
//         //.pipe(debug())
//         .pipe(gulp.dest('public/libs/js'));
// });
//
// // Copy IMG from FRONTEND
// gulp.task('copyIMG', function () {
//     return gulp.src('frontend/img/**/*.{png,jpg}', { since : gulp.lastRun('copyIMG')})
//         .pipe(newer('public'))
//         .pipe(imagemin())
//         .pipe(remember())
//         .pipe(gulp.dest('public/img'));
// });
//
// // Copy FONTS PB from FRONTEND
// gulp.task('copyFONTS-PB', function () {
//     return gulp.src('frontend/img/fonts/**/*.*', { since : gulp.lastRun('copyFONTS-PB')})
//         .pipe(newer('public'))
//         .pipe(gulp.dest('public/img/fonts'));
// });
//
// // Copy FONTS GLF from FRONTEND
// gulp.task('copyFONTS-GLF', function () {
//     return gulp.src('frontend/libs/fonts/**/*.*', { since : gulp.lastRun('copyFONTS-GLF')})
//         .pipe(newer('public'))
//         .pipe(gulp.dest('public/libs/fonts'));
// });
//
// // Copy JS from FRONTEND
// gulp.task('copyFVICO', function () {
//     return gulp.src('frontend/*.ico', { since : gulp.lastRun('copyFVICO')})
//         .pipe(newer('public'))
//         .pipe(gulp.dest('public'));
// });
//
// // ASSEMBLER COPY TASK
// gulp.task('build',
//     gulp.series([
//         'copyHTML',
//         'copyCSS',
//         'copyLibsCSS',
//         'copyJS',
//         'copyLibsJS',
//         'copyIMG',
//         'copyFONTS-PB',
//         'copyFONTS-GLF',
//         'copyFVICO'
//     ]));
//
// // "WATCH" Fn
// gulp.task('watch', function () {
//     gulp.watch('frontend/**/*.html', gulp.series('copyHTML'));
//     gulp.watch('frontend/css/**/*.css', gulp.series('copyCSS'));
//     gulp.watch('frontend/libs/css/**/*.css', gulp.series('copyLibsCSS'));
//     gulp.watch('frontend/js/**/*.js', gulp.series('copyJS'));
//     gulp.watch('frontend/libs/js/**/*.js', gulp.series('copyLibsJS'));
//     gulp.watch('frontend/img/**/*.{png,jpg}', gulp.series('copyIMG'));
//     gulp.watch('frontend/img/fonts/**/*.*', gulp.series('copyFONTS-PB'));
//     gulp.watch('frontend/libs/fonts/**/*.*', gulp.series('copyFONTS-GLF'));
//     gulp.watch('frontend/*.ico', gulp.series('copyFVICO'));
// });
//
// // BROWSER-SYNC config
// gulp.task('serve', function () {
//     browserSync.init({
//         proxy : 'http://localhost/',
//         port : 81
//     });
//    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
// });
// /*
// * *READY
// * */
//
// // build PRODUCTION
// gulp.task('prod', gulp.series('clean', 'build'));
//
// // build DEV & WATCH & BROWSER-SYNC
// gulp.task('default', gulp.series('clean','build', gulp.parallel('watch', 'serve')));
