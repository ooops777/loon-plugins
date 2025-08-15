// ===============================================
// AlphaSquare 高级会员解锁脚本
// 功能：解锁永久会员/增强用户资料/美化数据
// 匹配URL：^https?:\/\/api\.alphasquare\.co\.kr\/user\/v2\/users\/me
// 更新时间：2025-08-20
// 版本：v2.0
// ===============================================

// 主处理函数
function main() {
    try {
        // 仅处理目标API
        if (!$request.url.includes('/user/v2/users/me')) {
            console.log(`⏩ 跳过非目标请求: ${$request.url}`);
            return $done({});
        }
        
        // 仅处理GET请求
        if ($request.method !== "GET") {
            console.log(`⏩ 跳过非GET请求: ${$request.method}`);
            return $done({});
        }
        
        // 解析原始响应
        let body = $response.body;
        let userData = JSON.parse(body);
        console.log("✅ 原始用户数据解析成功");
        
        // 记录原始会员状态
        const originalStatus = {
            level: userData.subscription?.level || "free",
            expiry: userData.subscription?.expiry || "未订阅"
        };
        
        // 增强用户资料
        enhanceUserProfile(userData);
        
        // 生成新响应
        const newBody = JSON.stringify(userData);
        
        // 发送解锁通知
        $notification.post(
            '🎉 AlphaSquare 旗舰版已激活',
            `欢迎 ${userData.nickname || "尊贵会员"}`,
            `有效期至 2099-12-31\n会员等级: ${userData.subscription.level}`
        );
        
        console.log("✨ 用户资料增强完成");
        return $done({ body: newBody });
        
    } catch (error) {
        console.log(`❌ 脚本执行错误: ${error}`);
        return $done({});
    }
}

// 用户资料增强函数
function enhanceUserProfile(userData) {
    // ===== 基础信息美化 =====
    userData.nickname = userData.nickname || "AlphaVIP";
    userData.photo = "https://cdn.alphasquare.co.kr/profiles/premium_vip.jpg";
    userData.intro = "AlphaSquare旗舰会员 | 量化交易专家";
    
    // ===== 会员权限升级 =====
    userData.subscription = {
        level: "premium",
        status: "active",
        expiry: "2099-12-31T23:59:59Z",
        renewal: "auto",
        payment_method: "lifetime",
        since: "2020-01-01T00:00:00Z"
    };
    
    // ===== 权限角色增强 =====
    userData.roles = [
        "alphasquare:premium",
        "stock-navi-signal:pro",
        "chartgame:expert",
        "indicator-mining:advanced",
        "api:enterprise",
        "data:global"
    ];
    
    // ===== 统计数据美化 =====
    userData.statistics = {
        joined_at: "2020-01-01T00:00:00Z",
        last_login: new Date().toISOString(),
        login_count: 1286,
        premium_since: "2020-01-01T00:00:00Z",
        portfolio_growth: 247.3,
        win_rate: 82.4
    };
    
    // ===== 添加隐藏功能 =====
    userData.feature_flags = {
        dark_pool_access: true,
        ai_portfolio: true,
        insider_trading_alerts: true,
        institutional_flow: true,
        options_strategy: true
    };
    
    // ===== 连接状态增强 =====
    userData.connections = {
        broker_linked: true,
        exchange_connected: ["KRX", "NASDAQ", "NYSE", "JPX", "HKEX"],
        api_tokens: 5
    };
    
    // ===== 添加尊贵标识 =====
    userData.badges = [
        { name: "创始会员", icon: "crown" },
        { name: "钻石VIP", icon: "diamond" },
        { name: "交易宗师", icon: "trophy" }
    ];
    
    // ===== 诊断信息 =====
    userData._script_enhanced = true;
    userData._original_status = originalStatus;
    userData._enhanced_at = new Date().toISOString();
}

// 脚本入口
if (typeof $request !== 'undefined') {
    main();
} else {
    // 预览模式
    console.log("ℹ️ AlphaSquare 会员解锁脚本已加载");
    console.log("📌 匹配路径: /user/v2/users/me");
    console.log("💎 功能预览:");
    console.log(JSON.stringify({
        subscription: {
            level: "premium",
            expiry: "2099-12-31"
        },
        roles: ["alphasquare:premium", "..."]
    }, null, 2));
}
