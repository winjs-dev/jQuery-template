const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const layout = require('./html.hbs');
const header = require('@components/header/html.hbs');
const footer = require('@components/footer/html.hbs');
const dirsConfig = config.DIRS;

const pf = {
    pageTitle: '',
    bodyStyle: 'login-page',
    constructInsideUrl: noJquery.constructInsideUrl,
};

const moduleExports = {
    init({pageTitle}) {
        pf.pageTitle = pageTitle;
        return this;
    },
    run(content) {
        const headerRenderData = Object.assign(dirsConfig, pf);

        const renderData = {
            Header: header(headerRenderData),
            Footer: footer(),
            Content: content()
        };
        return layout(renderData);
    },
};

module.exports = moduleExports;
