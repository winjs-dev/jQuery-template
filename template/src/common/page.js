import '@less/app.less';
import i18n from '../lang/zh-cn';
import CT from '../config';

const main = {
  initialize: () => {
    window.i18n = i18n;
    window.CT = CT;
  }
};

main.initialize();
