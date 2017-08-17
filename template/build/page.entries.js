/**
 *
 * @authors liwb (you@example.org)
 * @date    2016/11/26 19:50
 * @version $ IIFE
 */

/* name module */
var glob = require('glob');
var config = require('./config');
var options = {
    cwd: config.directory.pages, // 在pages目录里找
    sync: true, // 这里不能异步，只能同步
};
var globInstance = new glob.Glob('!(_)*', options); // 考虑到多个页面共用HTML等资源的情况，跳过以'_'开头的目录

// 一个数组，形如['index/index', 'index/login', 'alert/index']
module.exports = globInstance.found;
