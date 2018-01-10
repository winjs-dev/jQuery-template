/**
 *
 * @authors liwb (you@example.org)
 * @date    2016/10/24 17:35
 * @version $ 考虑到所有的API都放到这里
 */

import xhr from './xhr';
import urls from './RESTFULLURL';

let FUNS = {};

Object.keys(urls).forEach((key) => {
  FUNS[key] = (options = {}, ...args) => {
    return xhr(urls[key], options, ...args);
  }
});

export default FUNS;
