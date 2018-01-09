import layout from './html.hbs';
import header from '@components/header/html.hbs';
import footer from '@components/footer/html.hbs';

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

export default moduleExports;
