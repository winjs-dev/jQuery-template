const content = require('./content.hbs');
const layout = require('layout');

module.exports = layout.init({
    pageTitle: 'AdminLTE 2 | Blank Page'
}).run(content);