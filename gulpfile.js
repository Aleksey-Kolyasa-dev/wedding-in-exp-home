"use strict";
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('default', function () {
  return gulp.src('public/**/*.*')
      .pipe(debug())
      .pipe(gulp.dest('frontend'));
});