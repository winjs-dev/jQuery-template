/**
 *
 * @authors Administrator (you@example.org)
 * @date    2015/10/10 10:29
 * @version $ IIFE
 * @description 定义全局服务
 */
var func = require('utils');

var xhr = {

  loadAjax: function (params) {
    params.async = (params.async === null || params.async === "" || typeof(params.async) === "undefined") ? "true" : params.async;  // 默认异步
    params.method = (params.method === null || params.method === "" || typeof(params.method) === "undefined") ? "get" : params.method;     // 默认get请求
    params.data = (params.data === null || params.data === "" || typeof(params.data) === "undefined") ? {"date": new Date().getTime()} : params.data;

    $.ajax({
      url: params.url,
      async: params.async,
      data: params.data,
      method: params.method,
      dataType: params.dataType || "json",
      timeout: 10000,
      headers: params.headers || null,
      contentType: params.contentType || 'application/x-www-form-urlencoded',
      beforeSend: params.beforeSend || null,
      complete: params.complete || null,
      success: params.success || null,
      error: params.error || null,

    });
  },

  /**
   * 加载 web接口
   * @param params
   */
  loadWeb: function (params) {
    params = params || {};
    params.method = 'post';
    var options = {};

    params.data = func.extend(params.data, options);

    xhr.loadAjax(params);

  },

  sendRequest: function (url, data, successFn, params) {

    var req = {
      url: G_CONFIG.api + url,
      data: data || {},
      success: function (res) {
        var jsonData = [res.data][0] ? res.data[0] : res;

        if (jsonData.error_no == '20') { // 登录超时

          return;
        }

        ($.isFunction(successFn)) && successFn(jsonData);
      },
      error: function (xhr, status) {
        func.logger(status);
      }
    }

    // 可选参数
    if (!$.isEmptyObject(params)) {
      // 同步
      if (params.async === false) {
        req.async = false;
      }

      if (params.contentType) {
        params.contentType = undefined
      }

      if (params.isUpload) { // 上传路径
        req.url = '';
        req.url = G_CONFIG.uploading_api + url;
      }
    }

    xhr.loadWeb(req);
  }
};

module.exports = xhr;
