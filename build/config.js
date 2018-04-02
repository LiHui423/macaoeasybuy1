const base64 = {
  baseDir: './',
  extensions: ['svg', 'png', 'jpg', 'jpeg'],
  maxImageSize: 8 * 1024,
  debug: false,
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
  collapseBooleanAttributes: false,
  collapseWhitespace: false,
  minifyJS: false,
  minifyCSS: false,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
};

const dev = process.env.NODE_ENV === 'development';

module.exports = {
  autoprefixer,
  base64,
  domain,
  htmlmin,
  dev,
};
