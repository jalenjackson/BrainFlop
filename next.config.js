const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withTM = require('next-plugin-transpile-modules');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(withSass(withImages(withTM({
  transpileModules: ['gsap'],
}))));

