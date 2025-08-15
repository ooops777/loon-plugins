// ===============================================
// Alphasquare 高级会员解锁脚本
// 匹配接口：
//   1. https://api.alphasquare.co.kr/user/v1/permissions
//   2. https://api.alphasquare.co.kr/payment/v1/subscriptions
// 更新时间：2025-08-15
// ===============================================

const url = $request.url;
const method = $request.method;

// 正则表达式定义
const PERMISSION_REGEX = /https:\/\/api\.alphasquare\.co\.kr\/user\/v1\/permissions(\?.*)?$/;
const SUBSCRIPTION_REGEX = /https:\/\/api\.alphasquare\.co\.kr\/payment\/v1\/subscriptions(\?.*)?$/;

try {
  if (method === 'GET') {
    // 权限接口处理
    if (PERMISSION_REGEX.test(url)) {
      let body = $response.body;
      let obj = JSON.parse(body);
      
      // 仅修改会员等级核心字段
      obj.membership_level = "alphasquare:premium";
      obj.is_premium = true;
      obj.expiration_date = "2099-12-31T23:59:59Z";
      
      body = JSON.stringify(obj);
      
      console.log("✅ 权限接口修改完成");
      $done({body});
    }
    // 订阅接口处理
    else if (SUBSCRIPTION_REGEX.test(url)) {
      let body = $response.body;
      let obj = JSON.parse(body);
      
      if (obj.data && obj.data.length > 0) {
        const sub = obj.data[0];
        sub.status = "active";
        sub.is_created = true;
        sub.expired_at = 4102444799000; // 2099-12-31
        sub.message = "Premium会员已永久激活";
      }
      
      body = JSON.stringify(obj);
      
      console.log("✅ 订阅接口修改完成");
      $done({body});
    }
    // 非目标接口
    else {
      $done({});
    }
  } else {
    $done({});
  }
} catch (e) {
  console.log(`❌ 脚本错误: ${e}`);
  $notification.post('脚本执行失败', e.message, '');
  $done({});
}
