var func = require('utils');

module.exports = function (timestamp) {

  return func.timeFormat(func.getUnixTimeStamp(timestamp));
}
