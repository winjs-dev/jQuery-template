var path = require('path')
var utils = require('./utils')
var config = require('./config')
var webpack = require('webpack')
var os = require('os')
var HappyPack = require('happypack')
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

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
      /* less */
      '@less': path.resolve(config.directory.assets, './less'),
      /* js */
      '@js': path.resolve(config.directory.assets, './js'),
      /* plugins */
      '@plugins': path.resolve(config.directory.assets, './plugins'),
      /* components */
      '@components': path.resolve(config.directory.src, './components'),

      /* bootstrap 相关 */
      'bootstrap': path.resolve(config.directory.nodeModules, './bootstrap/dist/js/bootstrap.min'),
      'bootstrap_css': path.resolve(config.directory.nodeModules, './bootstrap/dist/css/bootstrap.min.css'),

      /* components */

      /* layout */
      'layout': path.resolve(config.directory.layout, './with-nav/html'),
      'layout-without-nav': path.resolve(config.directory.layout, './without-nav/html'),

      'cp': path.resolve(config.directory.common, 'page'),

      // 项目公用
      'utils': path.resolve(config.directory.nodeModules, './cloud-utils/dist/cloud-utils.min'),
      'lang': path.resolve(config.directory.src, './lang/zh-cn'),
      'services': path.resolve(config.directory.src, './services'),

      'variable': path.resolve(config.directory.assets, './less/variable.less'),
      'mixins': path.resolve(config.directory.nodeModules, './magicless/magicless.less')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.resolve('src/common'), utils.resolve('src/helplers'), utils.resolve('src/layout'), utils.resolve('src/pages')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery'
      },
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=happybabel'],
        include: [utils.resolve('src/modules'), utils.resolve('test')]
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
