const path = require('path');
const config = require('./config');

const changeURI = (string) => {
  let result = '';
  if (string.includes('css')) {
    result = config.dev ? config.domain.style.dev : config.domain.style.prod;
  }
  if (string.includes('js')) {
    result = config.dev ? config.domain.script.dev : config.domain.script.prod;
  }
  if (string.includes('img')) {
    result = config.dev ? config.domain.images.dev : config.domain.images.prod;
  }
  result = string.replace('/src', config.dev ? `//${result}.macaoeasybuy.com` : `//${result}.macaoeasybuy.com`);
  return result;
};

const resolve = (string) => {
  return path.resolve(__dirname, string);
};

module.exports = {
  changeURI,
  resolve,
};
