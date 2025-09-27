/*
 * Loon 脚本: 解除新闻限制并修正时间
 * 类型: response-body
 * 作用: 
 * 1. 遍历响应体中的 JSON 数组，将所有条目的 "isRestricted" 状态从 true 改为 false。
 * 2. 将所有条目的 "publishedAt" 字段时间修改为当前的 UTC 时间。
 */

// 脚本主执行函数，通过 $done 传入修改后的响应体
$done({
    body: modifyNewsData($response.body)
});

/**
 * 核心处理函数，用于修改 JSON 数据。
 * @param {string} bodyStr 原始响应体字符串
 * @returns {string} 修改后的响应体字符串
 */
function modifyNewsData(bodyStr) {
    try {
        const jsonBody = JSON.parse(bodyStr);
        let restrictionCount = 0;
        
        // 获取当前的 UTC 时间字符串，格式如 2025-09-27T01:23:45.678Z
        const nowUtc = new Date().toISOString(); 

        // 假设响应体是一个包含新闻条目的数组
        if (Array.isArray(jsonBody)) {
            jsonBody.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    
                    // 1. 修改 isRestricted 状态
                    if ('isRestricted' in item && item.isRestricted === true) {
                        item.isRestricted = false;
                        restrictionCount++;
                    }
                    
                    // 2. 将 publishedAt 修改为当前时间，避免未来时间导致 App 排序混乱
                    if ('publishedAt' in item) {
                        item.publishedAt = nowUtc;
                    }
                }
            });
            console.log(`[Loon Script] 成功解除 ${restrictionCount} 个条目的限制，并更新了时间。`);
        } else {
            console.log(`[Loon Script] JSON 根结构不是数组，未执行修改。`);
        }

        // 将修改后的 JSON 对象重新转换为字符串
        return JSON.stringify(jsonBody);

    } catch (e) {
        // 捕获 JSON 解析错误，返回原始响应体
        console.log(`[Loon Script Error] JSON 解析或修改失败: ${e.message}`);
        return bodyStr;
    }
}
