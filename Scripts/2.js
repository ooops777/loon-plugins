// ===============================================
// AlphaSquare 权限修复脚本
// 功能：绕过权限限制/解锁付费API
// 匹配URL：^https?:\/\/api\.alphasquare\.co\.kr\/.*
// 更新时间：2025-08-20
// 版本：v3.0
// ===============================================

const PERMISSION_ERROR = "PERMISSION_DENIED";
const API_WHITELIST = [
    "/data/v6/analysis/indicator-analysis",
    "/chartgame/v1/users/me",
    "/payment/v1/subscriptions"
];

// 主处理函数
function main() {
    try {
        // 仅处理错误响应
        if (!$response || $response.status < 400) return $done({});
        
        const body = JSON.parse($response.body);
        if (body.code !== PERMISSION_ERROR) return $done({});
        
        console.log(`🚫 权限错误: ${body.message}`);
        
        // 根据API类型处理
        if (isWhitelistedAPI($request.url)) {
            console.log("🛠️ 处理白名单API权限错误");
            return fixPermissionError();
        } else {
            console.log("⚠️ 非白名单API，引导升级");
            return notifyUpgradeRequired();
        }
    } catch (e) {
        console.log(`❌ 错误处理失败: ${e.message}`);
        return $done({});
    }
}

// 修复权限错误
function fixPermissionError() {
    const url = $request.url;
    
    // 针对不同API返回伪造的成功响应
    if (url.includes("/indicator-analysis")) {
        return respondWithMockAnalysis();
    } 
    else if (url.includes("/chartgame")) {
        return respondWithMockChartGame();
    }
    else if (url.includes("/subscriptions")) {
        return respondWithPremiumSubscription();
    }
    
    return $done({});
}

// 返回模拟分析数据
function respondWithMockAnalysis() {
    console.log("📊 生成模拟分析数据");
    
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            status: "success",
            analysis_id: "ia_" + Date.now(),
            indicators: ["MACD", "RSI", "Bollinger"],
            confidence: 0.87,
            recommendation: "STRONG_BUY",
            simulated_returns: 24.7,
            _script_generated: true
        })
    });
}

// 返回模拟交易数据
function respondWithMockChartGame() {
    console.log("🎮 生成模拟交易权限");
    
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            id: "cg_" + Math.random().toString(36).slice(2),
            user_id: 43577,
            accounts: [
                {
                    id: "acc_01",
                    balance: 10000000,
                    portfolio_value: 12450000,
                    performance: 24.5
                }
            ],
            daily_resets: 10,
            premium_features: true,
            _script_unlocked: true
        })
    });
}

// 返回高级订阅信息
function respondWithPremiumSubscription() {
    console.log("💎 生成高级订阅信息");
    
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            active: true,
            plan: "premium",
            expires_at: 4102444800000, // 2099-12-31
            features: [
                "indicator-analysis", 
                "chartgame-pro", 
                "real-time-signals"
            ],
            payment_method: "lifetime",
            _script_override: true
        })
    });
}

// 通知需要升级
function notifyUpgradeRequired() {
    $notification.post(
        "⚠️ AlphaSquare 权限不足",
        "需要高级会员访问此功能",
        "点击查看订阅计划"
    );
    
    // 打开订阅页面
    $loon.openURL("alphasquare://premium/subscribe");
    
    return $done({});
}

// 检查是否在白名单API
function isWhitelistedAPI(url) {
    return API_WHITELIST.some(path => url.includes(path));
}

// 脚本入口
if (typeof $request !== 'undefined') {
    main();
} else {
    console.log("🔓 AlphaSquare 权限解锁脚本已加载");
    console.log("🛡️ 支持以下API权限修复:");
    console.log(JSON.stringify(API_WHITELIST));
}
