const fs = require('fs');
//const packageJson = fs.readFileSync('./package.json');
const path = require('path');
// const version = JSON.parse(packageJson).version || 0;
// const webpack = require('webpack');

module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'));
    config.resolve.alias.set('vue', '@vue/compat');
    config.resolve.set('fallback', {
      crypto: false,
      fs: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    });
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
    config.plugin('define').tap((definitions) => {
      definitions[0]['process.env']['PACKAGE_VERSION'] = JSON.stringify(require('./package.json').version);
      return definitions;
    });
    config
      .plugin('buffer') // <-arbitrary name to give this plugin entry I guess?
      .use(require.resolve('webpack/lib/ProvidePlugin'), [
        { Buffer: ['buffer', 'Buffer'] },
      ]);
    config
      .plugin('browser') // <-arbitrary name to give this plugin entry I guess?
      .use(require.resolve('webpack/lib/ProvidePlugin'), [
        { process: 'process/browser' },
      ]);
  },
  css: {
    loaderOptions: {
      sass: {
        // always import main.scss first
        additionalData: '@import "@/styles/_shared.scss";',
      },
    },
  },
  parallel: !process.env.NODE_ENV === 'production',
};
