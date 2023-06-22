const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.PACKAGE_VERSION': `"${version}"`,
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        'crypto': false,
        'fs': false,
        'stream': require.resolve('stream-browserify'),
        'buffer': require.resolve('buffer/'),
      },
    },
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
