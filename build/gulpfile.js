const del = require('del');
const gulp = require('gulp');
const $ = require('./gulp-plugin');
const utils = require('./utils');
const config = require('./config');
const FileCache = require('gulp-file-cache');

const cache = new FileCache();
const dev = process.env.NODE_ENV === undefined;
const PATTERN = /\/src\/(img|js|css)/gim;

gulp.task('script', () => {
  const filter = $.filter(['**', '!../src/**/*.min.js'], { restore: true });
  return gulp.src('../src/**/*.js', { read: false })
    .pipe(cache.filter())
    .pipe($.read())
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(filter)
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.replace(PATTERN, match => utils.changURI(match)))
    .pipe($.babel({
      presets: ['env'],
    }))
    .pipe($.uglify())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(filter.restore)
    .pipe(cache.cache())
    .pipe($.if(dev, $.rememberCache({
      dest: '../.tmp/js',
      cacheName: 'js',
    })))
    .pipe($.if(dev, gulp.dest('../dev'), gulp.dest('../dist')));
});

gulp.task('style:css', () => {
  const filter = $.filter(['**', '!../src/**/*.min.css'], { restore: true });
  return gulp.src('../src/**/*.css', { read: false })
    .pipe(cache.filter())
    .pipe($.read())
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(filter)
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.base64(config.base64))
    .pipe($.replace(PATTERN, match => utils.changURI(match)))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.cssnano())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(filter.restore)
    .pipe(cache.cache())
    .pipe($.if(dev, $.rememberCache({
      dest: '../.tmp/css',
      cacheName: 'css',
    })))
    .pipe($.if(dev, gulp.dest('../dev'), gulp.dest('../dist')));
});

gulp.task('style:scss', () => {
  return gulp.src('../src/**/*.scss', { read: false })
    .pipe(cache.filter())
    .pipe($.read())
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass())
    .pipe($.base64(config.base64))
    .pipe($.replace(PATTERN, match => utils.changURI(match)))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.cssnano())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(cache.cache())
    .pipe($.if(dev, $.rememberCache({
      dest: '../.tmp/scss',
      cacheName: 'scss',
    })))
    .pipe($.if(dev, gulp.dest('../dev'), gulp.dest('../dist')));
});

gulp.task('html', () => {
  return gulp.src('../src/**/*.html', { read: false })
    .pipe(cache.filter())
    .pipe($.read())
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.htmlmin())
    .pipe()
});
