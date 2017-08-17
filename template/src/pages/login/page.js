require('cp');
require('@plugins/iCheck/minimal/_all.css');
require('@plugins/iCheck/icheck.min');
require('./page.less');

$(function () {
  $('input').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-blue',
    increaseArea: '20%' // optional
  });
})

