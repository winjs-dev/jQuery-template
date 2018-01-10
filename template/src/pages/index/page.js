import 'cp';
import './page.less';
import services from 'services';

$(function () {
  console.log('index');
  const data = {
    tenant_key: '06db342e571d46da8867b79d7e8a47ea'
  };
  services.funcTenantInfoGet({
    data
  }, (res) => {
    console.log('接口请求成功：' + JSON.stringify(res, null, 2));
  }, (err) => {
    console.log('接口请求失败：' + JSON.stringify(err, null, 2));
  })
});
