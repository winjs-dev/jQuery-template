/**
 * 配置一些第三方依赖的路径
 *
 */

module.exports = {
  js: {
    html5shiv: require('!!file-loader?name=[name].[ext]!../assets/js/vendor/html5shiv.min.js'),
    respond: require('!!file-loader?name=[name].[ext]!../assets/js/vendor/respond.min.js'),
  },
  dll: {
    js: require('!!file-loader?name=assets/dll/[name].[ext]!../assets/dll/vendor.dll.js'),
    css: require('!file-loader?name=assets/dll/[name].[ext]!../assets/dll/vendor.dll.css'),
  },
};
