var func = require('utils');

module.exports = function (context, options) {

  return func.formatDate(func.getUnixTimeStamp(context), options.hash.pattern);
}
