require('./check-versions')()

var config = require('./config')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var webpack = require('webpack')
var webpackConfig = require('./webpack.dev.conf')
var WebpackDevServer = require('webpack-dev-server')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var compiler = webpack(webpackConfig)

var server = new WebpackDevServer(compiler, {
  // 指定的静态资源根目录
  contentBase: './src/',
  // proxy api requests
  proxy: proxyTable,
  hot: true,
  quiet: true,
  stats: {
    colors: true
  }
})

server.listen(port, 'localhost')

var uri = 'http://localhost:' + port

console.log('> Starting dev server...')
server.middleware.waitUntilValid(function() {
  console.log(`> Listening at ${uri}`);
  opn(`${uri}`);
})
