// ===============================================
// AlphaSquare 模拟交易账户增强脚本
// 适用路径：*/chartgame/account*
// 更新时间：2025-08-20
// 版本：v1.2
// ===============================================

const ENHANCEMENT_CONFIG = {
    assetMultiplier: 10,          // 资产倍增系数
    winRateBoost: 0.85,           // 胜率提升至85%
    diamondCount: 999,            // 钻石数量
    tier: "DIAMOND",              // 最高等级
    maxGameCount: 500,            // 最大游戏次数
    unlimitedResets: true         // 启用无限重置
};

// 主处理函数
function enhanceChartgameAccount() {
    try {
        // 验证响应
        if ($response.status !== 200) {
            console.log(`⏩ 跳过非200响应: ${$response.status}`);
            return $done({});
        }
        
        // 检查内容类型
        const contentType = $response.headers['Content-Type'] || '';
        if (!contentType.includes('application/json')) {
            console.log(`⏩ 跳过非JSON响应: ${contentType}`);
            return $done({});
        }
        
        // 解析原始响应
        let body = $response.body;
        let accounts = safeJsonParse(body);
        
        if (!accounts || !Array.isArray(accounts)) {
            console.log("❌ 账户数据解析失败");
            return $done({});
        }
        
        // 记录原始账户信息
        console.log("🔍 原始账户数据:");
        accounts.forEach(acc => {
            console.log(`• ${acc.name}: ${formatCurrency(acc.asset)} / 胜率 ${(acc.win_rate * 100).toFixed(1)}%`);
        });
        
        // 增强账户数据
        const enhancedAccounts = accounts.map(account => {
            return {
                ...account,
                asset: account.asset * ENHANCEMENT_CONFIG.assetMultiplier,
                init_asset: account.init_asset * ENHANCEMENT_CONFIG.assetMultiplier,
                win_rate: ENHANCEMENT_CONFIG.winRateBoost,
                win_count: Math.round(account.game_count * ENHANCEMENT_CONFIG.winRateBoost),
                loss_count: Math.round(account.game_count * (1 - ENHANCEMENT_CONFIG.winRateBoost)),
                diamond_count: ENHANCEMENT_CONFIG.diamondCount,
                tier: ENHANCEMENT_CONFIG.tier,
                game_count: ENHANCEMENT_CONFIG.maxGameCount,
                closed: false,
                is_premium: true,
                premium_features: ["无限资产", "胜率提升", "钻石特权"]
            };
        });
        
        // 生成新响应
        const newBody = JSON.stringify(enhancedAccounts);
        
        // 调试日志
        console.log("✨ 增强后账户数据:");
        enhancedAccounts.forEach(acc => {
            console.log(`• ${acc.name}: ${formatCurrency(acc.asset)} / 胜率 ${(acc.win_rate * 100).toFixed(1)}%`);
        });
        
        // 发送通知
        $notification.post(
            '💰 模拟账户已增强', 
            `资产x${ENHANCEMENT_CONFIG.assetMultiplier} | 胜率${ENHANCEMENT_CONFIG.winRateBoost * 100}%`,
            `${enhancedAccounts.length}个账户升级到${ENHANCEMENT_CONFIG.tier}等级`
        );
        
        // 返回修改后的响应（保留原始headers）
        return $done({
            headers: $response.headers,
            body: newBody
        });
        
    } catch (error) {
        console.log(`❌ 脚本执行错误: ${error.stack || error}`);
        $notification.post('账户增强失败', '请检查调试日志', error.message);
        return $done({});
    }
}

// 辅助函数：安全JSON解析
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log(`JSON解析错误: ${e.message}`);
        return null;
    }
}

// 辅助函数：货币格式化
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0
    }).format(amount);
}

// ====== 脚本执行 ======
if (typeof $request !== 'undefined' && typeof $response !== 'undefined') {
    // 确保是账户相关API
    if ($request.url.includes('/chartgame/account')) {
        enhanceChartgameAccount();
    } else {
        console.log(`⏩ 跳过非账户API: ${$request.url}`);
        $done({});
    }
} else {
    console.log("⚠️ 此脚本需要在Loon/Surge等环境中运行");
}
