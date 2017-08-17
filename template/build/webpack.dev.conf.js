var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [
    `webpack-dev-server/client?http://localhost:${config.dev.port}/`,
    "webpack/hot/dev-server"
  ].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 配置好Dll
    new webpack.DllReferencePlugin({
      context: config.directory.root, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
      manifest: require(config.directory.root + '/vendor-manifest.json'), // 指定manifest.json
    }),
    ...utils.genMultiHtmlPlugins(),
    new FriendlyErrorsPlugin()
  ]
});

module.exports = webpackConfig;

