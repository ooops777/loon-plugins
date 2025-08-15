// ==Loon==
// @name AlphaSquare Premium Unlock
// @desc Unlock all premium features for AlphaSquare
// @type http-response
// @pattern ^https:\/\/api\.alphasquare\.co\.kr\/user\/v1\/permissions(\/me)?$
// @requires-body true
// @timeout 60
// ==/Loon==

const premiumFeatures = {
  "watchlist_limit": "UNLIMITED",
  "watchlist_stock_limit": 100,
  "chart_types": "UNLIMITED",
  "chart_indicator_limit": "UNLIMITED",
  "chart_compare_limit": 4,
  "chart_strategy_roles": ["basic", "premium"],
  "multi_chart_limit": "UNLIMITED",
  "chartgame_review": true,
  "chartgame_account_limit": 10,
  "chartgame_freqs": "UNLIMITED",
  "chartgame_free_step": 100,
  "chartgame_free_reset_game_limit": 5,
  "chartgame_pattern_filter": "UNLIMITED",
  "chartgame_candle_count": 900,
  "chartgame_indicator_roles": ["basic", "premium"],
  "chartgame_strategy_roles": ["basic", "premium"],
  "chartgame_stock_types": "UNLIMITED",
  "trading_note_count_limit": "UNLIMITED",
  "special_stock_big_factor": "UNLIMITED",
  "indicator_mining_strategy_roles": ["basic", "premium"],
  "indicator_mining_signal_types": ["BUY", "SELL"],
  "indicator_mining_stock_types": "UNLIMITED",
  "indicator_mining_stock_limit": 20,
  "indicator_analysis_notification_limit": 100,
  "indicator_analysis_stock_type": "UNLIMITED",
  "indicator_analysis_config": true,
  "indicator_analysis_strategy_roles": ["basic", "premium"],
  "financial_limit": 40,
  "chart_prediction": true
};

if (typeof $response !== "undefined") {
  let original = JSON.parse($response.body);
  const url = $request.url;
  
  // 处理权限查询接口
  if (url.includes("/permissions/me")) {
    console.log("Upgrading user permissions to Premium level");
    
    // 升级到旗舰版权限
    for (const key in premiumFeatures) {
      if (original.hasOwnProperty(key)) {
        original[key] = premiumFeatures[key];
      }
    }
    
    // 添加旗舰标识
    original.premium = true;
    original.membership_level = "alphasquare:premium";
    original.membership_name = "旗舰版";
    original.membership_expiry = "2099-12-31T23:59:59Z";
  } 
  // 处理全局权限配置接口
  else if (url.endsWith("/permissions")) {
    console.log("Updating global permissions configuration");
    
    // 将所有套餐权限设置为旗舰版
    for (const key in original) {
      if (premiumFeatures.hasOwnProperty(key)) {
        if (typeof original[key] === "object" && original[key] !== null) {
          for (const plan in original[key]) {
            // 保留UNLIMITED字符串类型
            if (premiumFeatures[key] === "UNLIMITED") {
              original[key][plan] = "UNLIMITED";
            } else {
              original[key][plan] = premiumFeatures[key];
            }
          }
        }
      }
    }
  }
  
  // 转换回JSON并完成
  $done({ body: JSON.stringify(original) });
} else {
  console.log("AlphaSquare Premium Unlock script is running");
  $done({});
}
