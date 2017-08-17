/**
 * 工具类函数，不依赖于任何模块（除了全局的意外，如jquery,bootstrap）
 */

var func = {
  generateGUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
  },

  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 获取浏览器参数
  getUrlParam: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r !== null) return decodeURIComponent(r[2]);
    return null; //返回参数值
  },

  getHttpParams: function (name) {
    var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)");
    var m = location.href.match(r);
    return decodeURIComponent(!m ? "" : m[2]);
  },

  // state=broker:aaaa1111ccc;tenant:asdfasdf;view_tag:2;
  getUrlNames: function (name) {
    var urlParam = this.getUrlParam(name);
    var o = {};

    if (urlParam) {
      var str = urlParam.split(";");
      for (var i = 0, len = str.length; i < len; i++) {
        var str1 = str[i].split(":");
        o[str1[0]] = str1[1];
      }
    }

    return o;
  },

  // 支持类型:
  // http(s)://(username:password@)(www.)domain.(com/co.uk)(/...)
  // (s)ftp://(username:password@)domain.com/...
  // git://(username:password@)domain.com/...
  // irc(6/s)://host:port/... // 需要测试
  // afp over TCP/IP: afp://[<user>@]<host>[:<port>][/[<path>]]
  // telnet://<user>:<password>@<host>[:<port>/]
  // smb://[<user>@]<host>[:<port>][/[<path>]][?<param1>=<value1>[;<param2>=<value2>]]
  isUrl: function (url) {
    var protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?',
      userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?',
      domain = '([a-z0-9]([\\w]*[a-z0-9])*\\.)?[a-z0-9]\\w*\\.[a-z]{2,}(\\.[a-z]{2,})?',
      port = '(:\\d{1,5})?',
      ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}',
      address = '(\\/\\S*)?',
      domainType = [protocols, userInfo, domain, port, address],
      ipType = [protocols, userInfo, ip, port, address],
      validate;

    validate = function (type) {
      return new RegExp('^' + type.join('') + '$', 'i').test(url);
    };

    return validate(domainType) || validate(ipType);
  },

  /**
   * 有将 from 所有的键值对都添加到 to 上面去，返回 to
   *
   * @param {Object} to
   * @param {Object} from
   */

  extend: function (to, from) {
    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
      to[keys[i]] = from[keys[i]];
    }
    return to;
  },

  /**
   * Manual indexOf because it's slightly faster than
   * native.
   *
   * @param {Array} arr
   * @param {*} obj
   */
  indexOf: function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  },

  escape: (function () {
    var _reg = /<br\/?>$/,
      _map = {
        r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        ' ': '&nbsp;',
        '"': '&quot;',
        "'": '&#39;',
        '\n': '<br/>',
        '\r': ''
      };
    var _$encode = function (_map, _content) {
      _content = '' + _content;
      if (!_map || !_content) {
        return _content || '';
      }
      return _content.replace(_map.r, function ($1) {
        var _result = _map[!_map.i ? $1.toLowerCase() : $1];
        return _result != null ? _result : $1;
      });
    };
    return function (_content) {
      _content = _$encode(_map, _content);
      return _content.replace(_reg, '<br/><br/>');
    };
  })(),

  /**
   * @function escapeHTML 转义html脚本 < > & " '
   * @param a -
   *            字符串
   */
  escapeHTML: function (a) {
    a = "" + a;
    return a.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
    ;
  },

  /**
   * @function unescapeHTML 还原html脚本 < > & " '
   * @param a -
   *            字符串
   */
  unescapeHTML: function (a) {
    a = "" + a;
    return a.replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  },

  /**
   * 获取unix时间戳
   * @param time '20160126 12:00:00', '2016-01-26 12:00:00', '2016.01.26 12:00:00', '20160126', '2016-05-23 13:58:02.0'
   */
  getUnixTimeStamp: function (time) {
    var result = '';

    if (typeof time !== 'string') return;

    if (time.length > 19) { // 2016-05-23 13:58:02.0
      time = time.substring(0, 19);
    }

    var unix_time;
    var pattern = /\-|\./g;

    if (pattern.test(time)) {
      unix_time = time.replace(pattern, '/');
    } else {
      var y, m, d;
      y = time.slice(0, 4);
      m = time.slice(4, 6);
      d = time.slice(6, 8);
      unix_time = y + '/' + m + '/' + d;
    }
    result = Math.round(Date.parse(unix_time));

    return result;
  },

  timeFormat: function (ms) {

    ms = parseInt(ms);

    var d_second, d_minutes, d_hours, d_days;
    var timeNow = new Date().getTime();
    var d = (timeNow - ms) / 1000;
    d_days = Math.round(d / (24 * 60 * 60));
    d_hours = Math.round(d / (60 * 60));
    d_minutes = Math.round(d / 60);
    d_second = Math.round(d);
    if (d_days > 0 && d_days < 2) {
      return d_days + i18n.global.day_ago;
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + i18n.global.hour_ago;
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + i18n.global.minute_ago;
    } else if (d_minutes <= 0 && d_second >= 0) {
      return i18n.global.just_now;
    } else {
      var s = new Date();
      s.setTime(ms);
      //s.getFullYear() + '-' +
      return (f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' ' + f(s.getHours()) + ':' + f(s.getMinutes()));
    }

    function f(n) {
      if (n < 10)
        return '0' + n;
      else
        return n;
    }
  },

  /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
   可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
   Date()).fmt("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
   * (new Date()).fmt("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
   * (new Date()).fmt("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
   * (new Date()).fmt("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
   * (new Date()).fmt("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
   */
  formatDate: function (date, fmt) {
    date = date == undefined ? new Date() : date;
    date = typeof date == 'number' ? new Date(date) : date;
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    var week = {
      "0": "\u65e5",
      "1": "\u4e00",
      "2": "\u4e8c",
      "3": "\u4e09",
      "4": "\u56db",
      "5": "\u4e94",
      "6": "\u516d"
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;
  },

  matchUrl: function (string) {
    var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

    string = string.replace(reg, function (a) {
      if (a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1) {
        return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
      } else {
        return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
      }
    });
    return string;

  },

  /**
   * 为数字加上单位：万或亿
   *
   * 例如：
   *      1000.01 => 1000.01
   *      10000 => 1万
   *      99000 => 9.9万
   *      566000 => 56.6万
   *      5660000 => 566万
   *      44440000 => 4444万
   *      11111000 => 1111.1万
   *      444400000 => 4.44亿
   *      40000000,00000000,00000000 => 4000万亿亿
   *      4,00000000,00000000,00000000 => 4亿亿亿
   *
   * @param {number} number 输入数字.
   * @param {number} decimalDigit 小数点后最多位数，默认为2
   * @return {string} 加上单位后的数字
   */
  addChineseUnit: function () {
    var addWan = function (integer, number, mutiple, decimalDigit) {
      var digit = getDigit(integer);
      if (digit > 3) {
        var remainder = digit % 8;
        if (remainder >= 5) { // ‘十万’、‘百万’、‘千万’显示为‘万’
          remainder = 4;
        }
        return Math.floor(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万';
      } else {
        return Math.floor(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
      }
    };

    var getDigit = function (integer) {
      var digit = -1;
      while (integer >= 1) {
        digit++;
        integer = integer / 10;
      }
      return digit;
    };

    return function (number, decimalDigit) {
      decimalDigit = decimalDigit == null ? 2 : decimalDigit;
      var integer = Math.floor(number);
      var digit = getDigit(integer);
      // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
      var unit = [];
      if (digit > 3) {
        var multiple = Math.floor(digit / 8);
        if (multiple >= 1) {
          var tmp = Math.floor(integer / Math.pow(10, 8 * multiple));
          unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
          for (var i = 0; i < multiple; i++) {
            unit.push('亿');
          }
          return unit.join('');
        } else {
          return addWan(integer, number, 0, decimalDigit);
        }
      } else {
        return number;
      }
    };
  }(),

  getCharLength: function (str) {
    var iLength = 0,
      str = func.trim(str);
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        iLength += 2;
      } else {
        iLength += 1;
      }
    }
    return iLength;
  },

  jsonpcallback: function (data) {
    return data;
  },

  isMobile: function (str) {
    var reg = /^[1][34578]\d{9}$/;
    return reg.test(str);
  },

  isVaildCode: function (str) {
    var reg = /^\d{4}$/;
    return reg.test(str);
  },

  isNum: function (num) {
    return (!isNaN(num)) ? true : false;
  },

  isChar: function (str) {
    var l = str.length;

    for (var i = 0; i < l; i++) {
      var asc = str[i].charCodeAt();
      if (asc > 122 || asc < 65) {
        return false;
      }
    }
    if (i == l)
      return true;
  },

  isInteger: function (num) {
    var regInt = /^\d+$/;

    return regInt.test(num);
  },

  /**
   * 自动添加
   * @param stock
   * @returns {string|*}
   */
  appendStockSuffix: function (stock) {
    var regSS = /^(((700|730|900|600)[\d]{3})|60[\d]{4})$/;
    var regSZ = /^(((000|002|200)[\d]{3}|00[\d]{4}))$/;

    if (regSS.test(stock)) {
      stock += ".SS";
    } else if (regSZ.test(stock)) {
      stock += ".SZ";
    } else {
      stock += ".US";
    }

    return stock;
  },

  isLocalStorageNameSupported: function () {
    var win = window,
      localStorageName = 'localStorage';

    try {
      return (localStorageName in win && win[localStorageName]);
    } catch (err) {
      return false;
    }
  },

  setLocalStorageItem: function (item_key, item_value) {

    func.isLocalStorageNameSupported() && localStorage.setItem(item_key, item_value);
  },

  getLocalStorageItem: function (item_key) {
    if (func.isLocalStorageNameSupported()) {
      return localStorage.getItem(item_key);
    }
  },

  removeLocalStorageItem: function (item_key) {
    if (func.isLocalStorageNameSupported()) {
      return localStorage.removeItem(item_key);
    }
  },

  clearLoaclStorage: function () {
    func.isLocalStorageNameSupported() && localStorage.clear();
  },

  // convert bytes into friendly format
  bytesToSize: function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  },

  clearTimer: function (timer) {
    if (timer) {
      clearTimeout(timer);
      console.log('定时器清除成功');
    }
  },

  setTimer: function (callback, interval) {
    var timer = null;
    interval = interval || CT.INTERVAL;
    timer = setTimeout(function () {
      if (callback) callback();
      setTimeout(arguments.callee, interval);
    }, interval);

    return timer;
  },

  /**
   * 计算光标的位置，并插入str
   * @param obj
   * @param str
   */
  insertText: function (obj, str) {
    if (document.selection) { // IE
      var sel = document.selection.createRange();
      sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
      var startPos = obj.selectionStart,
        endPos = obj.selectionEnd,
        cursorPos = startPos,
        tmpStr = obj.value;
      obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
      cursorPos += str.length;
      obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
      obj.value += str;
    }
  },

  validateText: function (editor) {
    var text = func.trim(editor.val()),
      len = text.length,
      btn = $$('.btn-send');

    if (len > 0 && len < 301) {
      btn.removeClass('disabled');
    } else {
      btn.addClass('disabled');
    }
  },

  getElement: function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    return target;
  },

  stopBubble: function (event) {
    event = event ? event : window.event;
    if (!!event.stopPropogation) {
      event.stopPropogation();
    } else {
      event.cancelBubble = true;
    }
  },

  // 是否微信
  isWeixin: function () {
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') != -1;

    if (isWeixin) {
      return true;
    }

    return false;
  },

  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
   *
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @param  {object}     options   禁止第一次调用，传入{leading: false}。
   *                                禁止最后一次调用，传入{trailing: false}
   * @return {function}             返回客户调用函数
   */
  throttle: function (func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function () {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  },

  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @return {function}             返回客户调用函数
   */
  debounce: function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
      // 据上一次触发时间间隔
      var last = Date.now() - timestamp;

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  },

  toUnicode: function (str) {
    if (typeof str !== 'string') return;

    return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
  },

  toChinese: function (str) {
    if (typeof str !== 'string') return;

    return unescape(str.replace(/\\u/gi, '%u'));
  },

  preventFastClick: function (that) {
    that.addClass('disabled'); // 防止连续点击

    setTimeout(function () {
      that.removeClass('disabled');
    }, 1000);
  },

  callback: function (res, correct, err, isTips) {

    if (res.error_no === '0') {
      ($.isFunction(correct)) && correct();
    } else {
      ($.isFunction(err)) && err();
      if (isTips) {

      }
    }

  },

  /**
   * 删除数组指定元素
   * @param array
   * @param from 起始下标
   * @param to   结束下标，其中第二个参数可以忽略，这种情况下会删除指定下标的元素。
   * @returns {Number|*}
   */
  removeArr: function (array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;

    return array.push.apply(array, rest);
  },

  //log string(log) or object (dir)
  logger: function (msg) {
    if (typeof msg === 'string') {
      console.log(new Date().toISOString(), msg);
    }

    if (typeof msg === 'object') {
      console.dir(msg);
    }
  },

  bindEvents: function (bindings) {
    for (var i in bindings) {
      if (bindings[i].selector) {
        $(bindings[i].element)
          .off(bindings[i].event, bindings[i].selector, bindings[i].handler) // 防止重复绑定
          .on(bindings[i].event, bindings[i].selector, bindings[i].handler);
      } else {
        $(bindings[i].element)
          .off(bindings[i].event, bindings[i].selector, bindings[i].handler) // 防止重复绑定
          .on(bindings[i].event, bindings[i].handler);
      }
    }
  }

};

module.exports = func;
