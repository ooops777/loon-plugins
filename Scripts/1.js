// ===============================================
// AlphaSquare Premium 无限期会员解锁脚本
// 适用路径：api.alphasquare.co.kr/user/v1/permissions*
// 更新时间：2025-08-20
// 版本：v3.0 (永久维护版)
// ===============================================

// 常量定义 - 增强版权限配置
const PREMIUM_PERMISSIONS = {
    // 基础权限
    membership_level: "alphasquare:premium",
    membership_name: "旗舰版",
    is_premium: true,
    expiration_date: "2099-12-31T23:59:59Z",
    premium_since: "2025-01-01T00:00:00Z",
    
    // 观察列表权限增强
    watchlist_limit: "UNLIMITED",
    watchlist_stock_limit: 500,
    watchlist_alert_limit: 100,
    
    // 图表分析权限增强
    chart_types: ["CANDLE", "HEIKIN", "RENKO", "KAGI", "POINT_FIGURE"],
    chart_compare_limit: 8,
    chart_indicator_limit: "UNLIMITED",
    multi_chart_limit: 6,
    chart_strategy_roles: ["basic", "premium", "advanced", "quant"],
    chart_timeframes: ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"],
    
    // 模拟交易权限增强
    chartgame_review: true,
    chartgame_account_limit: 20,
    chartgame_freqs: ["tick", "minute", "5min", "15min", "hour", "day", "week", "month"],
    chartgame_free_step: 500,
    chartgame_free_reset_game_limit: 20,
    chartgame_pattern_filter: "UNLIMITED",
    chartgame_candle_count: 5000,
    chartgame_indicator_roles: ["basic", "premium", "advanced", "ai"],
    chartgame_strategy_roles: ["basic", "premium", "advanced", "quant"],
    chartgame_stock_types: ["KR-STOCK", "US-STOCK", "JP-STOCK", "HK-STOCK", "KRW-CRYPTO", "USDT-CRYPTO", "ETF", "FUTURES", "OPTIONS"],
    
    // 交易笔记与特殊股票增强
    trading_note_count_limit: "UNLIMITED",
    trading_note_attachment_limit: 50,
    special_stock_big_factor: ["price", "trading", "investor", "dividend", "short", "derivative", "insider", "institutional"],
    
    // 指标挖掘与分析增强
    indicator_mining_strategy_roles: ["basic", "premium", "advanced", "quant"],
    indicator_mining_signal_types: ["BUY", "SELL", "HOLD", "STRONG_BUY", "STRONG_SELL", "BREAKOUT", "REVERSAL"],
    indicator_mining_stock_types: ["KR-STOCK", "US-STOCK", "JP-STOCK", "EU-STOCK", "CRYPTO", "ETF", "GLOBAL", "COMMODITY"],
    indicator_mining_stock_limit: 200,
    indicator_analysis_notification_limit: 1000,
    indicator_analysis_config: true,
    indicator_analysis_strategy_roles: ["basic", "premium", "advanced", "ai"],
    indicator_analysis_stock_type: ["KR-STOCK", "US-STOCK", "JP-STOCK", "EU-STOCK", "CRYPTO", "ETF", "GLOBAL", "COMMODITY"],
    
    // 财务数据与预测增强
    financial_limit: "UNLIMITED",
    financial_history_years: 20,
    chart_prediction: true,
    prediction_models: ["LSTM", "ARIMA", "PROPHET", "GRU"],
    
    // AI功能增强
    ai_analysis_limit: "UNLIMITED",
    ai_portfolio_optimization: true,
    ai_signal_generation: true,
    
    // API权限
    api_access: true,
    api_rate_limit: 1000,
    api_history_days: 3650,
    
    // 会员专属功能
    premium_features: [
        "AI预测", "高级回测", "多屏图表", "实时警报", "API访问",
        "量化策略", "机构级数据", "全球市场", "暗池数据", "期权分析"
    ],
    
    // 脚本维护信息
    _script_maintained: true,
    _script_maintainer: "AlphaSquare-Premium-Project",
    _script_renewal: "automatic"
};

// 主函数
function main() {
    try {
        // 调试信息
        const now = new Date();
        const requestDetails = `[${now.toISOString()}] ${$request.method} ${$request.url}`;
        console.log(`📡 请求拦截: ${requestDetails}`);
        
        // 只处理目标API的GET请求
        if ($request.method !== "GET" || !$request.url.includes("/user/v1/permissions")) {
            console.log(`⏩ 跳过非目标请求: ${$request.method} ${$request.url}`);
            return $done({});
        }
        
        // 解析原始响应
        let original;
        try {
            original = JSON.parse($response.body);
            console.log("✅ 响应体解析成功");
        } catch (e) {
            console.log(`❌ JSON解析失败: ${e.message}`);
            return $done({});
        }
        
        // 记录原始权限摘要
        console.log("🔍 原始权限状态:");
        logPermissions(original, true);
        
        // 根据API类型处理权限
        if ($request.url.includes("/permissions/me")) {
            console.log("🛠️ 处理用户权限接口 (/me)");
            upgradeUserPermissions(original);
        } else if ($request.url.endsWith("/permissions")) {
            console.log("🛠️ 处理全局权限接口");
            upgradeGlobalPermissions(original);
        }
        
        // 记录升级后的权限
        console.log("✨ 升级后权限状态:");
        logPermissions(original);
        
        // 生成新响应
        const newBody = JSON.stringify(original);
        
        // 随机发送通知（避免频繁打扰）
        if (Math.random() > 0.7) {
            $notification.post(
                '🚀 AlphaSquare 旗舰版已激活', 
                '永久会员权限已解锁', 
                `有效期至 2099-12-31\n${getRandomFeature()}`
            );
        }
        
        // 返回修改后的响应
        return $done({ body: newBody });
        
    } catch (error) {
        // 错误处理
        console.log(`❌ 脚本执行错误: ${error.stack || error}`);
        return $done({});
    }
}

// 升级用户权限
function upgradeUserPermissions(data) {
    // 备份原始会员信息
    const original = {
        level: data.membership_level,
        name: data.membership_name,
        expiry: data.expiration_date,
        premium: data.is_premium
    };
    
    // 应用所有权限更新
    Object.keys(PREMIUM_PERMISSIONS).forEach(key => {
        data[key] = PREMIUM_PERMISSIONS[key];
    });
    
    // 保留原始信息用于诊断
    data._original_permissions = original;
    data._script_version = "3.0-permanent";
    data._last_updated = new Date().toISOString();
    
    console.log(`✅ 用户权限升级完成，应用 ${Object.keys(PREMIUM_PERMISSIONS).length} 项增强`);
}

// 升级全局权限配置
function upgradeGlobalPermissions(globalData) {
    let counter = 0;
    
    Object.keys(PREMIUM_PERMISSIONS).forEach(key => {
        if (globalData[key]) {
            // 更新所有套餐类型的权限
            const plans = globalData[key];
            Object.keys(plans).forEach(plan => {
                plans[plan] = PREMIUM_PERMISSIONS[key];
                counter++;
            });
        }
    });
    
    // 添加维护信息
    globalData._script_maintained = true;
    globalData._script_renewal_date = "2099-12-31";
    
    console.log(`✅ 全局权限升级完成，更新 ${counter} 项配置`);
}

// 权限日志记录
function logPermissions(data, isOriginal = false) {
    const prefix = isOriginal ? "原始-" : "升级-";
    const keys = [
        'membership_level', 'watchlist_stock_limit', 
        'chart_compare_limit', 'chartgame_account_limit',
        'indicator_mining_stock_limit', 'financial_limit'
    ];
    
    keys.forEach(key => {
        const value = data[key] || 'N/A';
        console.log(`   ${prefix}${key}: ${JSON.stringify(value).slice(0, 40)}`);
    });
    
    console.log(`   ${prefix}会员状态: ${data.is_premium ? '高级' : '普通'} (${data.expiration_date || '无期限'})`);
}

// 获取随机功能提示
function getRandomFeature() {
    const features = [
        "✅ 无限观察列表 & 500支股票追踪",
        "✅ 20个模拟交易账户 & 5000根K线",
        "✅ 量化策略支持 & AI信号生成",
        "✅ 全球市场数据 & 暗池交易分析",
        "✅ 20年财务历史 & 预测模型",
        "✅ 1000次/分钟API访问权限"
    ];
    return features[Math.floor(Math.random() * features.length)];
}

// 自维护系统
function selfMaintain() {
    const maintainers = ["AlphaSquare-Premium-Project", "Loon-Scripts-Community"];
    const nextUpdate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90天后
    
    console.log("🔧 自维护系统激活");
    console.log(`  维护团队: ${maintainers.join(", ")}`);
    console.log(`  下次维护: ${nextUpdate.toISOString()}`);
    
    // 添加维护元数据
    PREMIUM_PERMISSIONS._maintainers = maintainers;
    PREMIUM_PERMISSIONS._next_update = nextUpdate.toISOString();
}

// 脚本入口
(function init() {
    // 执行自维护程序
    selfMaintain();
    
    // 在Loon环境中执行主函数
    if (typeof $request !== 'undefined' && $request.url) {
        main();
    } else {
        console.log("ℹ️ 脚本已加载，等待权限API请求...");
        console.log("💎 当前权限配置预览:");
        console.log(JSON.stringify({
            level: PREMIUM_PERMISSIONS.membership_level,
            features: PREMIUM_PERMISSIONS.premium_features.slice(0, 5),
            expiration: PREMIUM_PERMISSIONS.expiration_date
        }, null, 2));
    }
})();
