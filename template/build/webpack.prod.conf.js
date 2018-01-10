'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': require('./config/prod.env')
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        exclude: /node_module\/\.min\.js$/,
        // http://pinkyjie.com/2016/03/05/webpack-tips/
        // 使用module的.name属性来决定一个service的名字，然后在别的地方使用依赖注入来引入这个service的话，这个时候一旦你使用-p参数，程序就会报错：找不到provider，MockDataProvider <- MockData。因为在e2e.data.js文件中你export的class虽然叫MockData，但这个名字会被UglifyJsPlugin改掉。这是因为这个插件有一个mangle选项，会对所有函数名变量名进行混淆，在压缩的同时保证安全。
        // {except: ['$', 'exports', 'require']},
        mangle: false,
        compress: {
          warnings: false,
          drop_console: true
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    ...utils.genMultiHtmlPlugins(),
    // cache Module Identifiers, keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    // 配置好Dll
    new webpack.DllReferencePlugin({
      // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
      context: config.directory.root,
      // 指定manifest.json
      manifest: require(config.directory.root + '/vendor-manifest.json'),
    }),
    // 添加版本号
    new webpack.BannerPlugin('current version: ' + new Date()),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: config.directory.dll,
        to: 'assets/dll'
      },
      {
        from: path.resolve(config.directory.assets, 'images/copyfiles'),
        to: 'assets/images/copyfiles'
      },
      {
        from: path.resolve(config.directory.src, 'config.default.js'),
        to: 'config.default.js'
      },
      {
        from: config.directory.vendor + '/html5shiv.min.js',
        to: 'assets/html5shiv.min.js'
      }, {
        from: config.directory.vendor + '/respond.min.js',
        to: 'assets/respond.min.js'
      }
    ])
  ]
})

if (config.build.productionImagemin) {
  const ImageminPlugin = require('imagemin-webpack-plugin').default
  
  webpackConfig.plugins.push(
    // Make sure that the plugin is after any plugins that add images
    new ImageminPlugin({
      test: 'assets/**',
      disable: process.env.NODE_ENV !== 'production', // Disable during development
      pngquant: {
        quality: '65-80'
      }
    })
  )
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
