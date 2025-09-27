/*
 * Loon 脚本: SPARK_INSIGHT 权限强制解锁 (V7)
 * 作用: 将 Spark Insight 或其他内容的解锁状态从 false 强制改为 true。
 */
$done({
    body: JSON.stringify({
        "unlockCost": null,
        "unlocked": true,
        "transaction": "LoonBypass",
        "expiresAt": "2099-12-31T23:59:59Z",
        "key": $request.url.match(/key=(\d+)/) ? $request.url.match(/key=(\d+)/)[1] : "Bypass_Key", // 尝试从 URL 中提取 key
        "type": "SPARK_INSIGHT", // 保持类型不变
        "unlockedAt": "2099-12-31T23:59:59Z"
    })
});
