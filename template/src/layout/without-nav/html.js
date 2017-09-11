const layout = require('./html.hbs');
const header = require('@components/header/html.hbs');
const footer = require('@components/footer/html.hbs');

const pf = {
  pageTitle: '',
  bodyStyle: 'login-page'
};

const moduleExports = {
  init({pageTitle}) {
    pf.pageTitle = pageTitle;
    return this;
  },
  run(content) {
    const renderData = {
      Header: header(pf),
      Footer: footer(),
      Content: content()
    };
    return layout(renderData);
  }
};

module.exports = moduleExports;
