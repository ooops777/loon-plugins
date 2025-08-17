// Loon/Surge脚本
const TARGET_URL = "https://vayne-api.myduty.kr/v1/users/";

if ($request.url.includes(TARGET_URL) && $request.url.includes("/preference")) {
  try {
    const body = JSON.parse($response.body);
    
    // 强制解锁高级功能
    if (body.data?.preferences) {
      body.data.preferences = {
        ...body.data.preferences,
        // 解锁专业版功能开关
        is_pro_mode: true,
        export_quality: "professional",
        max_duty_units: 999,
        // 伪装订阅状态
        subscription_status: "active",
        subscription_expiry: "2099-12-31"
      };
    }
    
    // 添加隐藏权限标识
    body.entitlements = ["premium_export", "unlimited_units"];
    
    // 添加调试信息
    body.debug = {
      injected: true,
      timestamp: Date.now()
    };
    
    $done({ body: JSON.stringify(body) });
    
  } catch (e) {
    console.error(`偏好修改失败: ${e}`);
    $done({});
  }
} else {
  $done({});
}
