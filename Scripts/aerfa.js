// ===============================================
// AlphaSquare Premium 会员权限优化解锁脚本
// 适用路径：api.alphasquare.co.kr/user/v1/permissions*
// 更新时间：2025-08-20
// 版本：v2.0
// ===============================================

// 常量定义
const PREMIUM_PERMISSIONS = {
    // 观察列表权限
    watchlist_limit: "UNLIMITED",
    watchlist_stock_limit: 100,
    
    // 图表分析权限
    chart_types: "UNLIMITED",
    chart_compare_limit: 4,
    chart_indicator_limit: "UNLIMITED",
    multi_chart_limit: "UNLIMITED",
    chart_strategy_roles: ["basic", "premium", "advanced"],
    
    // 模拟交易权限
    chartgame_review: true,
    chartgame_account_limit: 10,
    chartgame_freqs: ["minute", "hour", "day", "week", "month"],
    chartgame_free_step: 100,
    chartgame_free_reset_game_limit: 5,
    chartgame_pattern_filter: "UNLIMITED",
    chartgame_candle_count: 900,
    chartgame_indicator_roles: ["basic", "premium", "advanced"],
    chartgame_strategy_roles: ["basic", "premium", "advanced"],
    chartgame_stock_types: ["KR-STOCK", "US-STOCK", "KRW-CRYPTO", "USDT-CRYPTO", "ETF", "FUTURES"],
    
    // 交易笔记与特殊股票
    trading_note_count_limit: "UNLIMITED",
    special_stock_big_factor: ["price", "trading", "investor", "dividend", "short", "derivative"],
    
    // 指标挖掘与分析
    indicator_mining_strategy_roles: ["basic", "premium", "advanced"],
    indicator_mining_signal_types: ["BUY", "SELL", "HOLD", "STRONG_BUY", "STRONG_SELL"],
    indicator_mining_stock_types: ["KR-STOCK", "US-STOCK", "CRYPTO", "ETF", "GLOBAL"],
    indicator_mining_stock_limit: 50,
    indicator_analysis_notification_limit: 200,
    indicator_analysis_config: true,
    indicator_analysis_strategy_roles: ["basic", "premium", "advanced"],
    indicator_analysis_stock_type: ["KR-STOCK", "US-STOCK", "CRYPTO", "ETF", "GLOBAL"],
    
    // 财务数据与预测
    financial_limit: 100,
    chart_prediction: true,
    
    // 会员信息
    membership_level: "alphasquare:premium",
    membership_name: "旗舰版",
    is_premium: true,
    expiration_date: "2099-12-31T23:59:59Z",
    premium_features: ["AI预测", "高级回测", "多屏图表", "实时警报", "API访问"]
};

// 主函数
function main() {
    try {
        // 调试信息
        const requestDetails = `[${new Date().toISOString()}] ${$request.method} ${$request.url}`;
        console.log(`📡 请求详情: ${requestDetails}`);
        
        // 只处理GET请求
        if ($request.method !== "GET") {
            console.log(`⏩ 跳过非GET请求: ${$request.method}`);
            return $done({});
        }
        
        // 只处理权限相关API
        if (!$request.url.includes("/user/v1/permissions")) {
            console.log(`⏩ 跳过非权限API: ${$request.url}`);
            return $done({});
        }
        
        // 解析原始响应
        let body = $response.body;
        let original = safeJsonParse(body);
        
        if (!original) {
            console.log("❌ 响应体解析失败，原始内容: " + body.substring(0, 200));
            return $done({});
        }
        
        // 记录原始权限摘要
        const originalSummary = getPermissionSummary(original);
        console.log("🔍 原始权限摘要:\n" + originalSummary);
        
        // 根据API类型处理权限
        if ($request.url.endsWith("/permissions/me")) {
            console.log("🛠️ 处理用户权限接口 (/me)");
            upgradeUserPermissions(original);
        } else if ($request.url.endsWith("/permissions")) {
            console.log("🛠️ 处理全局权限接口");
            upgradeGlobalPermissions(original);
        } else {
            console.log("⚠️ 未知权限API，跳过处理");
            return $done({});
        }
        
        // 记录升级后的权限摘要
        const upgradedSummary = getPermissionSummary(original);
        console.log("✨ 升级后权限摘要:\n" + upgradedSummary);
        
        // 生成新响应
        const newBody = JSON.stringify(original);
        
        // 发送通知
        $notification.post(
            '🎉 AlphaSquare 旗舰版已激活', 
            '所有高级功能已解锁', 
            `有效期至 2099-12-31\n${getFeatureSummary()}`
        );
        
        // 返回修改后的响应
        return $done({ body: newBody });
        
    } catch (error) {
        // 错误处理
        console.log(`❌ 脚本执行错误: ${error.stack || error}`);
        $notification.post('脚本执行失败', '请检查调试日志', error.message);
        return $done({});
    }
}

// 安全解析JSON
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log(`JSON解析错误: ${e.message}`);
        return null;
    }
}

// 升级用户权限
function upgradeUserPermissions(permissions) {
    // 保留原始会员信息（如果存在）
    const originalMembership = {
        level: permissions.membership_level,
        name: permissions.membership_name,
        expiry: permissions.expiration_date
    };
    
    // 应用所有权限更新
    for (const key in PREMIUM_PERMISSIONS) {
        if (PREMIUM_PERMISSIONS.hasOwnProperty(key)) {
            permissions[key] = PREMIUM_PERMISSIONS[key];
        }
    }
    
    // 保留原始会员信息用于日志
    permissions._original_membership = originalMembership;
    
    // 添加额外属性
    permissions.premium_since = new Date().toISOString();
    permissions.feature_unlocked = Object.keys(PREMIUM_PERMISSIONS).length;
    
    console.log(`✅ 用户权限升级完成，解锁 ${permissions.feature_unlocked} 项功能`);
}

// 升级全局权限配置
function upgradeGlobalPermissions(globalConfig) {
    let featuresUpgraded = 0;
    
    for (const permissionKey in globalConfig) {
        if (PREMIUM_PERMISSIONS.hasOwnProperty(permissionKey)) {
            const plans = ["alphasquare:basic", "alphasquare:standard", "alphasquare:pro", "alphasquare:premium"];
            
            for (const plan of plans) {
                if (globalConfig[permissionKey].hasOwnProperty(plan)) {
                    // 特殊处理UNLIMITED值
                    if (PREMIUM_PERMISSIONS[permissionKey] === "UNLIMITED") {
                        globalConfig[permissionKey][plan] = "UNLIMITED";
                    } else {
                        globalConfig[permissionKey][plan] = PREMIUM_PERMISSIONS[permissionKey];
                    }
                    featuresUpgraded++;
                }
            }
        }
    }
    
    // 添加版本信息
    globalConfig._script_version = "2.0";
    globalConfig._last_updated = new Date().toISOString();
    
    console.log(`✅ 全局权限升级完成，更新 ${featuresUpgraded} 项配置`);
}

// 获取权限摘要
function getPermissionSummary(data) {
    const features = [
        {name: "观察列表", key: "watchlist_limit"},
        {name: "图表分析", key: "chart_indicator_limit"},
        {name: "模拟交易", key: "chartgame_account_limit"},
        {name: "高级分析", key: "indicator_analysis_config"},
        {name: "财务数据", key: "financial_limit"},
        {name: "图表预测", key: "chart_prediction"}
    ];
    
    return features.map(f => {
        const value = data[f.key];
        const displayValue = typeof value === "object" ? JSON.stringify(value).slice(0, 20) + "..." : value;
        return `• ${f.name}: ${displayValue}`;
    }).join("\n");
}

// 获取功能摘要
function getFeatureSummary() {
    const features = [
        "✅ 无限观察列表",
        "✅ 多图表分析",
        "✅ 高级模拟交易",
        "✅ AI图表预测",
        "✅ 全球市场数据",
        "✅ 实时交易信号"
    ];
    
    return features.slice(0, 3).join("\n") + "\n...";
}

// 脚本入口
if (typeof $request !== 'undefined' && typeof $response !== 'undefined') {
    main();
} else {
    console.log("⚠️ 此脚本需要在代理工具环境中运行");
    console.log("ℹ️ 模拟执行结果:");
    console.log(JSON.stringify(PREMIUM_PERMISSIONS, null, 2));
}
