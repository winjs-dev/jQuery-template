'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

const createLintingRule = () => ({
  test: /\.js$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src/modules')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

var base = {
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': utils.resolve('src'),
      /* assets */
      '@assets': utils.resolve('src/assets'),
      /* less */
      '@less': utils.resolve('src/assets/less'),
      /* js */
      '@js': utils.resolve('src/assets/js'),
      /* plugins */
      '@plugins': utils.resolve('src/assets/plugins'),
      /* components */
      '@components': utils.resolve('src/components'),

      /* bootstrap 相关 */
      'bootstrap': utils.resolve('node_modules/bootstrap/dist/js/bootstrap.min'),
      'bootstrap_css': utils.resolve('node_modules/bootstrap/dist/css/bootstrap.min.css'),

      /* components */

      /* layout */
      'layout': utils.resolve('src/layout/with-nav/html'),
      'layout-without-nav': utils.resolve('src/layout/without-nav/html'),

      'cp': utils.resolve('src/common/page'),

      // 项目公用
      'services': utils.resolve('src/services'),
      'lang': utils.resolve('src/lang/zh-cn'),
      'variable': utils.resolve('src/assets/less/variable.less'),
      'utils': utils.resolve('node_modules/cloud-utils/dist/cloud-utils.min'),
      'mixins': utils.resolve('node_modules/magicless/magicless.less'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [createLintingRule()] : []),
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery'
      },
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=happybabel'],
        include: [utils.resolve('src/pages'), utils.resolve('src/services'), utils.resolve('src/layout'), utils.resolve('src/helpers'), utils.resolve('src/config'), utils.resolve('src/common')]
      },
      {
        test: /\.html$/,
        use: ['happypack/loader?id=happyhtml'],
        include: config.directory.src,
      },
      {
        test: /\.hbs/,
        loader: 'handlebars-loader',
        include: config.directory.src,
        options: {
          helperDirs: config.directory.src + '/helpers'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src/assets'), utils.resolve('node_modules')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src/assets'), utils.resolve('node_modules')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src/assets'), utils.resolve('node_modules')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // 全局shimming
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),

    //开启 happypack 的线程池
    //原有的 webpack 对 loader 的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),

    new HappyPack({
      id: 'happyhtml',
      loaders: ['raw-loader'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
  ]
}

if(process.env.NODE_ENV !== 'dll') {
  var pageArr = require('./page.entries');
  var configEntry = {};

  pageArr.forEach((page) => {
    configEntry[page] = path.resolve(config.directory.pages, page + '/page');
  });

  base.entry = configEntry;
}

module.exports = base;
