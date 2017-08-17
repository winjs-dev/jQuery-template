const content = require('./content.hbs');
const layout = require('layout-without-nav');

module.exports = layout.init({
  pageTitle: 'AdminLTE 2 | Log in',
}).run(content);
