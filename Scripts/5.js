/*
 * ===============================================
 * [强化版] myduty 프리미엄 활성화 스크립트
 * 适用API: /v1/user/me, /account, /subscription/*
 * 更新日期: 2025-08-17
 * ===============================================
 */
const DEBUG_MODE = true;
const TARGET_APIS = [
  "/v1/user/me", 
  "/v2/account/info",
  "/subscription/status",
  "/entitlements/verify"
];

const PREMIUM_USER_DATA = {
  level: "PREMIUM",
  userType: 2,
  isPremium: true,
  subscription: {
    expiresDate: "2099-12-31T23:59:59Z",
    subscriptionId: "myduty_premium",
    productId: "myduty_premium_lifetime",
    purchaseDate: new Date().toISOString(),
    status: "active",
    signature: generateFakeSignature()
  },
  entitlements: [
    "unlimited_duty", 
    "advanced_hamster", 
    "premium_support"
  ],
  limits: {
    dutyUnit: 9999,
    hamster: 9999,
    group: 9999
  },
  localValidation: {
    timestamp: Date.now(),
    isPremium: true
  }
};

function generateFakeSignature() {
  return "fake_sign_" + Math.random().toString(36).slice(2, 18);
}

function debugLog(message) {
  if (DEBUG_MODE) console.log(`[DEBUG] ${message}`);
}

function main() {
  try {
    // 检查是否为目标API
    const isTargetApi = TARGET_APIS.some(api => $request.url.includes(api));
    if (!isTargetApi) {
      debugLog("⚠️ 跳过非目标API: " + $request.url);
      return $done({});
    }

    const body = $response.body;
    let obj = JSON.parse(body);
    debugLog("✅ 目标API请求: " + $request.url);

    // 深度查找user对象
    let user = findUserObject(obj);
    
    if (user) {
      debugLog(`🔍 找到用户对象 (原始等级: ${user.level || 'N/A'})`);
      
      // 注入Premium数据
      Object.assign(user, PREMIUM_USER_DATA);
      debugLog("✨ 用户数据升级完成");
      
      // 清除可能的缓存
      if (typeof $cache !== 'undefined') {
        $cache.delete("user_profile_cache");
        debugLog("🗑️ 用户缓存已清除");
      }
      
      // 发送通知
      if (typeof $notification !== 'undefined') {
        $notification.post(
          '🎉 프리미엄 활성화 성공',
          '모든 제한이 해제되었습니다',
          '2099년까지 유효한 프리미엄 계정'
        );
      }
      
      return $done({ body: JSON.stringify(obj) });
    }
    
    console.log("⛔ 未找到用户对象，检查响应结构");
    $done({});
    
  } catch (e) {
    console.error(`❌ 严重错误: ${e.stack}`);
    $done({});
  }
}

// 深度查找用户对象
function findUserObject(obj, depth = 0) {
  if (depth > 3) return null; // 防止无限递归
  
  for (let key in obj) {
    if (key.toLowerCase() === "user") return obj[key];
    if (typeof obj[key] === "object") {
      const result = findUserObject(obj[key], depth + 1);
      if (result) return result;
    }
  }
  return null;
}

main();
