'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', () => {
   gulp.src('./css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', () => gulp.watch('./css/*.scss', ['sass']));

gulp.task('browser-sync', () => {
   var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "./"
      }
   });

});

gulp.task('default', ['browser-sync'], () => gulp.start('sass:watch'));

gulp.task('clean', () => del(['dist']));

gulp.task('copyfonts', () => {
   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', () => {
  gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', () => {
  gulp.src('./*.html')
  .pipe(flatmap((stream, file) => {
      return stream
      .pipe(usemin({
        css: [ rev() ],
        html: [ () => htmlmin({ collapseWhitespace: true }) ],
        js: [ uglify(), rev() ],
        inlinejs: [ uglify() ],
        inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build',['clean'], () => gulp.start('copyfonts','imagemin','usemin'));
