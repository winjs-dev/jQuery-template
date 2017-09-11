/**
 *
 * @authors Administrator (you@example.org)
 * @date    2015/10/10 10:29
 * @version $ IIFE
 * @description 定义全局服务
 */
import config from 'config';

function xhr(url, {
  async = true,
  prefix = '',
  method = 'post',
  data = {
    'date': new Date().getTime()
  },
  timeout = 10000,
  headers = {},
  contentType = 'application/x-www-form-urlencoded',
  beforeSend = function() {}
}) {
  return $.ajax({
    url: appendUrlPrefix(prefix) + url,
    async: async,
    data: data,
    method: method,
    timeout: timeout,
    headers: headers,
    contentType: contentType,
    beforeSend: beforeSend
  });
}

/**
 * 扩展不同url前缀
 * 如根域名是'muziso.com'， 有不同扩展，client, common等，方法可随着项目更改
 * @param type
 * @returns {*}
 */
function appendUrlPrefix(prefix) {
  if (prefix === '1') {
    return window.LOCAL_CONFIG.API_HOME + config.OPEN_API;
  }
}

export default xhr;
