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

const link = {
  css: ['//css.macaoeasybuy.com/css/', '//easystyle.macaoeasybuy.com/css/'],
  js: ['//js.macaoeasybuy.com/js/', '//easyscript.macaoeasybuy.com/js/'],
  img: ['//img.macaoeasybuy.com/img/', '//systemimages.macaoeasybuy.com/img/'],
};

function changLink(string, dev) {
    let result = '';
    string.indexOf('css') !== -1 && (result = dev ? css.dev : css.prod);
    string.indexOf('js') !== -1 && (result = dev ? js.dev : js.prod);
    string.indexOf('img') !== -1 && (result = dev ? img.dev : img.prod);
    return string.substring(0,1) + link;
}
/**
 *
 * @param {string} sp - src path
 * @param {string} dp - dev path
 */
function js(srcPath = 'src/js/**/*.js', devPath = 'dev/js') {
    const isGlob = srcPath.indexOf('*') !== -1;
    const filterVendorFile = filter(['**', '!**/vendor/*.js'], {restore: true});
    return gulp.src(srcPath)
        .pipe(gif(isGlob, filterVendorFile))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(replace(/("|'|\()\/src\/(css|js|img)\//gim, match => link(match, true)))
        .pipe(babel({presets: ['env']}))
        .pipe(sourcemaps.write('.'))
        .pipe(filterVendorFile.restore)
        .pipe(gulp.dest(destPath));
}
function css(sp, dp) {
    const srcPath = typeof sp === 'string' ? sp : 'src/css/**/*.css';
    const destPath = typeof dp === 'string' ? dp : 'dev/css';
    const isGlob = srcPath.indexOf('*') !== -1;
    const filterVendorFile = m.filter(['**', '!**/vendor/*.css'], {restore: true});
    return gulp.src(srcPath)
        .pipe(m.if(isGlob, filterVendorFile))
        .pipe(m.replace(/("|'|\()\/(css|js|img)\//gim, match => link(match, 'dev')))
        .pipe(filterVendorFile.restore)
        .pipe(gulp.dest(destPath));
}
function scss(sp, dp) {
    const srcPath = typeof sp === 'string' ? sp : 'src/css/**/*.scss';
    const destPath = typeof dp === 'string' ? dp : 'dev/css';
    const isGlob = srcPath.indexOf('*') !== -1;
    return gulp.src(srcPath)
        .pipe(m.sourcemaps.init())
        .pipe(m.sass().on('error', m.sass.logError))
        .pipe(m.autoprefixer(
            { browsers: ['last 2 version', 'not ie <= 8'] }
        ))
        .pipe(m.base64({
          baseDir: 'src',
          extensions: ['svg', 'png', 'jpg', 'jpeg'],
          maxImageSize: 8 * 1024,
          debug: true,
        }))
        .pipe(m.replace(/("|'|\()\/(css|js|img)\//gim, match => link(match, 'dev')))
        .pipe(m.sourcemaps.write('.'))
        .pipe(gulp.dest(destPath));
}
function html(sp, dp) {
    const srcPath = typeof sp === 'string' ? sp : 'src/html/**/*.html';
    const destPath = typeof dp === 'string' ? dp : 'dev/html';
    const isGlob = srcPath.indexOf('*') !== -1;
    return gulp.src(srcPath)
        .pipe(m.replace(/("|'|\()\/(css|js|img)\//gim, match => link(match, 'dev')))
        .pipe(gulp.dest(destPath));
}
function htmlP() {
    const options = {
        removeComments: true,
        collapseWhitespace: false,
        collapseBooleanAttributes: false,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: false,
        minifyCSS: false
    }
    return gulp.src('dev/html/**/*.html')
        .pipe(m.replace(/("|'|\()\/{2}(css|js|img).macaoeasybuy/gim, match => link(match, 'prod')))
        .pipe(m.htmlmin(options))
        .pipe(gulp.dest('dist/page'));
}
function jsP() {
    return gulp.src('dev/js/**/*.js')
        .pipe(m.replace(/("|'|\()\/{2}(css|js|img).macaoeasybuy/gim, match => link(match, 'prod')))
        .pipe(gulp.dest('dist/js'));
}
function cssP() {
    return gulp.src('dev/css/**/*css')
        .pipe(m.replace(/("|'|\()\/{2}(css|js|img).macaoeasybuy/gim, match => link(match, 'prod')))
        .pipe(gulp.dest('dist/css'));
}
gulp.task('build', gulp.parallel(htmlP, cssP, jsP));
gulp.task('preview', gulp.parallel(js, css, scss, html));
gulp.task('dev', () => {
    gulp.watch('src/**/*.(js|css|scss|html)').on('all', (event, file) => {
        const SRCDIR = path.dirname(file).replace(/\\/gim, '/');
        const FILENAME = path.basename(file);
        const EXTNAME = path.extname(file).substring(1);
        const SRCPATH = SRCDIR + '/' + FILENAME;
        const DEVDIR = SRCDIR.replace('src', 'dev');
        const TIME = new Date();
        const logTime = `[${TIME.getHours()}:${TIME.getMinutes()}:${TIME.getSeconds()}]`;
        console.log(logTime, event, FILENAME, `where ${SRCDIR}`);
        if (event === 'unlink') {
            del(`${DEVDIR}/${FILENAME}*`);
            return;
        }
        EXTNAME === 'js' && js(SRCPATH, DEVDIR);
        EXTNAME === 'scss' && scss(SRCPATH, DEVDIR);
        EXTNAME === 'css' && css(SRCPATH, DEVDIR);
        EXTNAME === 'html' && html(SRCPATH, DEVDIR);
    });
});
