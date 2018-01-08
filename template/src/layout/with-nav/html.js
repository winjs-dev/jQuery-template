// 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const layout = require('./html.hbs');
const header = require('@components/header/html.hbs');
const footer = require('@components/footer/html.hbs');
const topNav = require('@components/topNav/html.hbs');
const sidebar = require('@components/sidebar/html.hbs');
const crumbs = require('@components/crumbs/html.hbs');
const contabs = require('@components/contabs/html.hbs');

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

module.exports = moduleExports;
