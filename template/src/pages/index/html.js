const content = require('./content.hbs');
const layout = require('layout');

module.exports = layout.init({
    pageTitle: 'AdminLTE 2 | Dashboard'
}).run(content);