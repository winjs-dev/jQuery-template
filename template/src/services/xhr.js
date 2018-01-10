/**
 *
 * @authors Administrator (you@example.org)
 * @date    2015/10/10 10:29
 * @version $ IIFE
 * @description 定义全局服务
 */
import autoMatchBaseUrl from './autoMatchBaseUrl';

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response) {
    const status = response.status;
    if (status === 200 || status === 304 || status === 400) {
      // 如果不需要除了data之外的数据，可以直接 return response.data
      return response;
    } else {
      let errorInfo = '';
      switch (status) {
        case -1:
          errorInfo = '远程服务响应失败,请稍后重试';
          break;
        case 400:
          errorInfo = '400: 错误请求';
          break;
        case 401:
          errorInfo = '401: 访问令牌无效或已过期';
          break;
        case 403:
          errorInfo = '403: 拒绝访问';
          break;
        case 404:
          errorInfo = '404：资源不存在';
          break;
        case 405:
          errorInfo = '405: 请求方法未允许'
          break;
        case 408:
          errorInfo = '408: 请求超时'
          break;
        case 500:
          errorInfo = '500：访问服务失败';
          break;
        case 501:
          errorInfo = '501：未实现';
          break;
        case 502:
          errorInfo = '502：无效网关';
          break;
        case 503:
          errorInfo = '503: 服务不可用'
          break;
        default:
          errorInfo = `连接错误${status}`
      }
      return {
        status,
        msg: errorInfo
      }
    }
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  };
}

export default function xhr(url, {
  async = true,
  prefix = window.CT.OPEN_PREFIX,
  method = 'post',
  data = {},
  timeout = 10000,
  headers = {},
  dataType = 'json',
  contentType = 'application/x-www-form-urlencoded',
  beforeSend = function () {},
  success = function () {}
}) {
  const baseURL = autoMatchBaseUrl(prefix);
  
  headers = Object.assign(method === 'get' ? {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  } : {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }, headers);
  
  return $.ajax({
    url: baseURL + url,
    method,
    async,
    data,
    timeout,
    headers,
    dataType,
    contentType,
    beforeSend
  }).done((response) => {
    return checkStatus(response);
  }).fail((err) => {
    console.error(JSON.stringify(err));
  }).always((status) => {
    console.log(JSON.stringify(status));
  });
}
