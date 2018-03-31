const base64 = {
  baseDir: '../',
  extensions: ['svg', 'png', 'jpg', 'jpeg'],
  maxImageSize: 8 * 1024,
  debug: true,
};
const domain = {
  style: {
    dev: 'css',
    prod: 'easystyle',
  },
  script: {
    dev: 'js',
    prod: 'easyscript',
  },
  images: {
    dev: 'img',
    prod: 'systemimages',
  },
};
const autoprefixer = {
  browsers: ['last 2 version', 'not ie <= 8'],
};
const htmlmin = {
  removeComments: true,
  collapseWhitespace: false,
  collapseBooleanAttributes: false,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyJS: false,
  minifyCSS: false
};
module.exports = {
  autoprefixer,
  base64,
  domain,
  htmlmin,
  postcss,
};
