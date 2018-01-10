import content from './content.hbs';
import layout from 'layout-without-nav';

export default layout.init({
  pageTitle: 'AdminLTE 2 | Dashboard'
}).run(content);
