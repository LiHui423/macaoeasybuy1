const path = require('path');
const config = require('./config');

const dev = process.env.NODE_ENV === undefined;

const changURI = (string) => {
  if (string.includes('css')) {
    return dev ? config.domain.style.dev : config.domain.style.prod;
  }
  if (string.includes('js')) {
    return dev ? config.domain.script.dev : config.domain.script.prod;
  }
  if (string.includes('img')) {
    return dev ? config.domain.images.dev : config.domain.images.prod;
  }
};

const resolve = (string) => {
  return path.resolve(__dirname, string);
};

module.exports = {
  changURI,
  resolve,
};
