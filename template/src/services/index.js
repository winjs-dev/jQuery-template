/**
 *
 * @authors liwb (you@example.org)
 * @date    2016/10/24 17:35
 * @version $ 考虑到所有的API都放到这里
 */

import xhr from './xhr';

export function login(data) {
  return xhr('/usercenter/user/mobile_login', {data});
}
