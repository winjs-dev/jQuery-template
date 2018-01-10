// 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
import layout from './html.hbs';
import header from '@components/header/html.hbs';
import footer from '@components/footer/html.hbs';
import topNav from '@components/topNav/html.hbs';
import sidebar from '@components/sidebar/html.hbs';
import crumbs from '@components/crumbs/html.hbs';
import contabs from '@components/contabs/html.hbs';

// 整理渲染公共部分所用到的模板变量
const pf = {
  pageTitle: '',
  bodyStyle: 'skin-blue sidebar-mini'
};

const moduleExports = {
  // 处理各个页面传入而又需要在公共区域用到的参数
  init(params) {
    // 比如说页面名称，会在<title>或面包屑里用到
    pf.pageTitle = params.pageTitle;
    return this;
  },
  // 整合各公共组件和页面实际内容，最后生成完整的HTML文档
  run(content) {
    const renderData = {
      Header: header(pf),
      Footer: footer(),
      TopNav: topNav(),
      Sidebar: sidebar(),
      Crumbs: crumbs(),
      Contabs: contabs(),
      Content: content()
    };
    return layout(renderData);
  }
};

export default moduleExports;
