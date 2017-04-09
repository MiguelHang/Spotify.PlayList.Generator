'use strict';

let gulp = require('gulp')
let gutil = require('gulp-util')
let concat = require('gulp-concat')
let uglify = require('gulp-uglify')
let babel = require('gulp-babel')
let ngAnnotate = require('gulp-ng-annotate')
let replace = require('gulp-replace')
let sass = require('gulp-sass')
let argv = require('yargs').argv

gulp.task('concat', () => {
  gulp.src(['app.js', 'app/directives/*.js', 'app/interceptors/*.js', 'app/modules/*.js', 'app/modules/**/*.js', 'app/components/**/*.js', 'app/templates/*.js'])
  .pipe(concat('bundles/bundle.js'))
  .pipe(gulp.dest('.'))
})

gulp.task('compile', () => {
  gulp.src(['bundles/bundle.js'])
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('bundles/.'))
})

gulp.task('compress', () => {
  gulp.src(['bundles/bundle.js'])
  .pipe(ngAnnotate())
  .pipe(uglify()).on('error', gutil.log)
  .pipe(gulp.dest('bundles/.'))
})

gulp.task('build', () => {
  if (argv.api) {
    gulp.src(['app.js', 'app.filters.js', 'app/directives/*.js', 'app/interceptors/*.js', 'app/modules/*.js', 'app/modules/**/*.js', 'app/templates/*.js', 'app/templates/**/*.js'])
    .pipe(concat('bundles/bundle.js'))
    .pipe(replace(/(baseService = 'http:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#]{2,256}\b([-a-zA-Z0-9@:%_\+.~#'\s?&//]*)')/, 'baseService = \'' + argv.api + '\''))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(ngAnnotate())
    .pipe(uglify().on('error', function(e){
      console.log(e);
     }))
    .pipe(gulp.dest('.'))
  } else {
    console.log('api parameter is required! --api [http://ip:port/api/]')
  }
})

gulp.task('watch',  () => {
  gulp.watch(['app.js', 'app.filters.js', 'app/directives/*.js', 'app/interceptors/*.js', 'app/modules/*.js', 'app/modules/**/*.js', 'app/templates/*.js', 'app/templates/**/*.js'], ['concat'])
})

gulp.task('concatSass', () => {
  gulp.src(['app/assets/css/*.sass'])
  .pipe(concat('bundles/bundle.sass'))
  .pipe(sass())
  .pipe(gulp.dest('.'))
})

gulp.task('watchSass', () => {
  gulp.watch(['app/assets/css/*.sass'], ['concatSass'])
})
