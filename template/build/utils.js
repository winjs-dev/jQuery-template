'use strict'
const path = require('path')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
const pkg = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = isProd
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProd,
      sourceMap: options.sourceMap
    }
  }
  
  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  
  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    } else {
      return ['style-loader'].concat(loaders)
    }
  }
  
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}

// is prodution
exports.isProduction = function () {
  return isProd
}

/**
 * 多入口生成多页面
 * @returns {Array}
 * generate dist index.html with correct asset hash for caching.
 * you can customize output by editing /index.html
 * see https://github.com/ampedandwired/html-webpack-plugin
 */
exports.genMultiHtmlPlugins = function () {
  var pagesArr = require('./page.entries');
  var plugins = [];
  
  pagesArr.forEach(function (page) {
    plugins.push(
      isProd ? new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: path.join(config.directory.pages, `./${page}/html.js`),
          chunks: ['vendor', 'manifest', page],
          inject: true,
          hash: true, // 为静态资源生成hash值
          xhtml: true,
          minify: {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //删除空白符与换行符
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency'
        })
        : new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: path.join(config.directory.pages, `./${page}/html.js`),
          inject: true,
          chunks: [page]
        })
    )
  })
  
  return plugins
}

exports.createNotifierCallback = function () {
  const notifier = require('node-notifier')
  
  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }
    const error = errors[0]
    
    const filename = error.file.split('!').pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      // icon: path.join(__dirname, 'logo.png')
    })
  }
}
