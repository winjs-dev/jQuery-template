import 'cp';
import '@plugins/iCheck/minimal/_all.css';
import '@plugins/iCheck/icheck.min';
import './page.less';

$(function () {
  $('input').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-blue',
    increaseArea: '20%' // optional
  });
})
