const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const path = require('path');

const m = gulpLoadPlugins({lazy: true});
function link(string, env) {
    const css = {
        dev: '//css.macaoeasybuy.com/css/',
        prod: '//easystyle.macaoeasybuy'
    };
    const js = {
        dev: '//js.macaoeasybuy.com/js/',
        prod: '//easyscript.macaoeasybuy'
    };
    const img = {
        dev: '//img.macaoeasybuy.com/img/',
        prod: '//systemimages.macaoeasybuy'
    };
    let link = '';
    string.indexOf('css') !== -1 && (link = env === 'dev' ? css.dev : css.prod);
    string.indexOf('js') !== -1 && (link = env === 'dev' ? js.dev : js.prod);
    string.indexOf('img') !== -1 && (link = env === 'dev' ? img.dev : img.prod);
    return string.substring(0,1) + link;
}
function js(sp, dp) {
    const srcPath = typeof sp === 'string' ? sp : 'src/js/**/*.js';
    const destPath = typeof dp === 'string' ? dp : 'dev/js';
    const isGlob = srcPath.indexOf('*') !== -1;
    const filterVendorFile = m.filter(['**', '!**/vendor/*.js'], {restore: true});
    return gulp.src(srcPath)
        .pipe(m.if(isGlob, filterVendorFile))
        .pipe(m.plumber())
        .pipe(m.sourcemaps.init())
        .pipe(m.replace(/("|'|\()\/(css|js|img)\//gim, match => link(match, 'dev')))
        .pipe(m.babel({presets: ['env']}))
        .pipe(m.sourcemaps.write('.'))
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
        .pipe(m.replace(/("|'|\()\/(css|js|img)\//gim, match => link(match, 'dev')))
        .pipe(m.sass().on('error', m.sass.logError))
        .pipe(m.autoprefixer(
            { browsers: ['last 2 version', 'not ie <= 8'] }
        ))
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
