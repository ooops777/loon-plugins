// ===============================================
// Alphasquare Premium 会员解锁脚本 (仅解锁会员等级)
// 适用路径：api.alphasquare.co.kr/user/v1/permissions
// 更新时间：2025-08-15
// ===============================================

const url = $request.url;
const method = $request.method;

if (method === 'GET' && url.includes('/user/v1/permissions')) {
  try {
    let body = $response.body;
    let obj = JSON.parse(body);
    
    // 仅修改会员等级相关字段
    obj.membership_level = "alphasquare:premium";
    obj.is_premium = true;
    obj.expiration_date = "2099-12-31T23:59:59Z";
    
    // 保留原始权限设置
    console.log("仅修改会员等级，保留其他权限不变");
    
    // 生成新响应
    body = JSON.stringify(obj);
    
    $notification.post(
      '🎉 Alphasquare 高级会员已激活', 
      '会员等级升级为Premium', 
      '有效期至2099-12-31'
    );
    
    $done({body});
    
  } catch (e) {
    console.log(`❌ 脚本执行错误: ${e}`);
    $notification.post('脚本执行失败', '请检查调试日志', e.message);
    $done({});
  }
} else {
  $done({});
}
