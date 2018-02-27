const gulp = require('gulp');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const base64 = require('gulp-base64');
const filter = require('gulp-filter');
const gif = require('gulp-if');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const del = require('del');
const path = require('path');

const REGEXP = /\/src\/(img|js|css)/gim;

const DEV = true;

const DOMAIN = {
  style: { dev: 'css', prod: 'easystyle' },
  javascript: { dev: 'js', prod: 'easyscript' },
  images: { dev: 'img', prod: 'systemimages' },
};

const postcssPlugins = [
  autoprefixer({browsers: ['last 2 version', 'not ie <= 8']}),
  cssnano()
];
/**
 *
 * @param {string} string
 */
function changeURI(string) {
  let doo = '';
  if (string.indexOf('css') !== -1) {
    doo = DEV ? DOMAIN.style.dev : DOMAIN.style.prod;
  } else if (string.indexOf('js') !== -1) {
    doo = DEV ? DOMAIN.javascript.dev : DOMAIN.javascript.prod;
  } else {
    doo = DEV ? DOMAIN.images.dev : DOMAIN.images.prod;
  }
  doo = string.replace('/src', DEV ? `//${doo}.macaoeasybuy.com` : `//${doo}.macaoeasybuy.com`);
  return doo;
}
/**
 *
 * @param {string} src - src path
 */
function javascript(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/js/**/*.js';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/js' : 'dist/js');
  const isGlob = SRCPATH.indexOf('*') !== -1;
  const filterVendorFile = filter(['**', '!**/vendor/*.js'], {restore: true});
  return gulp.src(SRCPATH)
    .pipe(gif(isGlob, filterVendorFile))
    .pipe(plumber())
    .pipe(gif(DEV, sourcemaps.init()))
    .pipe(replace(REGEXP, match => changeURI(match)))
    .pipe(babel({ presets: ['env'] }))
    .pipe(gif(DEV, sourcemaps.write('.')))
    .pipe(filterVendorFile.restore)
    .pipe(gulp.dest(DESTPATH));
}
function styleCSS(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/css/**/*.css';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/css' : 'dist/css');
  const isGlob = SRCPATH.indexOf('*') !== -1;
  const filterVendorFile = filter(['**', '!**/vendor/*.css'], {restore: true});
  return gulp.src(SRCPATH)
    .pipe(gif(isGlob, filterVendorFile))
    .pipe(replace(REGEXP, match => changeURI(match)))
    .pipe(filterVendorFile.restore)
    .pipe(gulp.dest(DESTPATH));
}
function styleSCSS(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/css/**/*.scss';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src', 'dev') : (DEV ? 'dev/css' : 'dist/css');
  const isGlob = SRCPATH.indexOf('*') !== -1;
  return gulp.src(SRCPATH)
    .pipe(gif(DEV, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(base64({
      baseDir: './',
      extensions: ['svg', 'png', 'jpg', 'jpeg'],
      maxImageSize: 8 * 1024,
      debug: true,
    }))
    .pipe(replace(REGEXP, match => changeURI(match)))
    .pipe(gif(DEV, sourcemaps.write('.')))
    .pipe(gulp.dest(DESTPATH));
}
function html(src) {
  const isSingleFile = typeof src === 'string';
  const SRCPATH = isSingleFile ? src : 'src/html/**/*.html';
  const DESTPATH = isSingleFile ? path.dirname(SRCPATH).replace('src/html', 'dev/page') : (DEV ? 'dev/page' : 'dist/page');
  const isGlob = SRCPATH.indexOf('*') !== -1;
  return gulp.src(SRCPATH)
    .pipe(replace(REGEXP, match => changeURI(match)))
    .pipe(gulp.dest(DESTPATH));
}
// function htmlP() {
//     const options = {
//         removeComments: true,
//         collapseWhitespace: false,
//         collapseBooleanAttributes: false,
//         removeEmptyAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         minifyJS: false,
//         minifyCSS: false
//     }
//     return gulp.src('dev/page/**/*.html')
//         .pipe(replace(/("|'|\()\/{2}(css|js|img).macaoeasybuy/gim, match => changeURI(match, 'prod')))
//         // .pipe(htmlmin(options))
//         .pipe(gulp.dest('dist/page'));
// }
// function cssP() {
//     return gulp.src('dev/css/**/*css')
//         .pipe(m.replace(/("|'|\()\/{2}(css|js|img).macaoeasybuy/gim, match => changeURI(match, 'prod')))
//         .pipe(gulp.dest('dist/css'));
// }
// function jsP() {
//   return gulp.src('dev/js/**/*.js')
//     .pipe(m.replace)
// }
gulp.task('build', gulp.parallel(javascript, styleCSS, styleSCSS, html));
gulp.task('preview', gulp.parallel(javascript, styleCSS, styleSCSS, html));
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
