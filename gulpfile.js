const gulp = require('gulp');
const path = require('path');
const $ = require('./build/plugins');
const config = require('./build/config');
const utils = require('./build/utils');

const DEV = config.dev;

const REGEXP = /\/src\/(img|js|css)/gim;

function javascript(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/js/**/*.js';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/js' : 'dist/js');
  const isGlob = SRCPATH.includes('*');
  const filterMinFile = $.filter(['**', '!**/*.min.js'], {restore: true});
  return gulp.src(SRCPATH)
    .pipe($.if(isGlob, filterMinFile))
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(DEV, $.sourcemaps.init()))
    .pipe($.replace(REGEXP, match => utils.changeURI(match)))
    .pipe($.babel({ presets: ['env'] }))
    .pipe($.uglify())
    .pipe($.if(DEV, $.sourcemaps.write('.')))
    .pipe(filterMinFile.restore)
    .pipe(gulp.dest(DESTPATH));
}
function styleCSS(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/css/**/*.css';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/css' : 'dist/css');
  const isGlob = SRCPATH.includes('*');
  const filterMinFile = $.filter(['**', '!**/*.min.css'], {restore: true});
  return gulp.src(SRCPATH)
    .pipe($.if(isGlob, filterMinFile))
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(DEV, $.sourcemaps.init()))
    .pipe($.base64(config.base64))
    .pipe($.replace(REGEXP, match => utils.changeURI(match)))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.cssnano())
    .pipe($.if(DEV, $.sourcemaps.write('.')))
    .pipe(filterMinFile.restore)
    .pipe(gulp.dest(DESTPATH));
}
function styleSCSS(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/css/**/*.scss';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/css' : 'dist/css');
  const isGlob = SRCPATH.includes('*');
  return gulp.src(SRCPATH)
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(DEV, $.sourcemaps.init()))
    .pipe($.sass({
      outputStyle: 'expanded',
    }))
    .pipe($.base64(config.base64))
    .pipe($.replace(REGEXP, match => utils.changeURI(match)))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.cssnano())
    .pipe($.if(DEV, $.sourcemaps.write('.')))
    .pipe(gulp.dest(DESTPATH));
}
function html(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/html/**/*.html';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src/html', 'dev/page') : (DEV ? 'dev/page' : 'dist/page');
  const isGlob = SRCPATH.indexOf('*') !== -1;
  return gulp.src(SRCPATH)
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>'),
    }))
    .pipe($.if(DEV, $.sourcemaps.init()))
    .pipe($.replace(REGEXP, match => utils.changeURI(match)))
    .pipe($.htmlmin(config.htmlmin))
    .pipe($.if(DEV, $.sourcemaps.write('.')))
    .pipe(gulp.dest(DESTPATH));
}
gulp.task('build', gulp.parallel(javascript, styleCSS, styleSCSS, html));
gulp.task('dev', () => {
    gulp.watch('src/**/*.(js|css|scss|html)').on('all', (event, file) => {
        const DIRNAME = path.dirname(file).replace(/\\/gim, '/');
        const FILENAME = path.basename(file);
        const EXTNAME = path.extname(file).substring(1);
        const SRCPATH = DIRNAME + '/' + FILENAME;
        const DEVDIR = DIRNAME.replace('src', 'dev');
        const TIME = new Date();
        const logTime = `[${TIME.getHours()}:${TIME.getMinutes()}:${TIME.getSeconds()}]`;
        console.log(logTime, event, FILENAME, `where ${DIRNAME}`);
        if (event === 'unlink') {
            del(`${DEVDIR}/${FILENAME}*`);
            return;
        }
        EXTNAME === 'js' && javascript(SRCPATH);
        EXTNAME === 'scss' && styleSCSS(SRCPATH);
        EXTNAME === 'css' && styleCSS(SRCPATH);
        EXTNAME === 'html' && html(SRCPATH);
    });
});
