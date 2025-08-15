[Script]
enable = true
name = VIP Unlock
type = http-response
pattern = ^https?:\/\/api\.(mydramawave|dramaapp)\.com\/user\/account
requires-body = true
script = 
  let body = $response.body;
  try {
    let obj = JSON.parse(body);
    if (obj.data) {
      // 修改VIP状态
      obj.data.vip_level = 2;  // 设置为VIP等级2
      obj.data.vip_expire = 4102444800;  // 2100年1月1日的时间戳
      obj.data.vip_used = true;
      
      // 解锁所有内容权限
      obj.data.auto_unlock = 1;
      obj.data.novel_auto_unlock = 1;
      
      // 隐藏VIP推广内容
      obj.data.show_vip_banner = false;
      obj.data.show_subscript = false;
      
      // 修改VIP特权描述
      obj.data.button_desc = "VIP 활성화됨";
      obj.data.title_desc = "모든 콘텐츠 잠금 해제";
      
      // 移除月节省提示
      obj.data.save_monthly_text = "";
      
      // 更新响应体
      body = JSON.stringify(obj);
    }
  } catch (e) {
    console.log("VIP解锁脚本错误: " + e.message);
  }
  $done({body});

[MitM]
enable = true
hostname = api.mydramawave.com, api.dramaapp.com
