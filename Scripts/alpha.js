// ===============================================
// Alphasquare Premium 会员解锁脚本
// 适用路径：api.alphasquare.co.kr/user/v1/permissions
// 更新时间：2025-08-15
// ===============================================

const url = $request.url;
const method = $request.method;

if (method === 'GET' && url.includes('/user/v1/permissions')) {
  try {
    let body = $response.body;
    let obj = JSON.parse(body);
    
    // 调试日志
    console.log("原始权限数据:");
    console.log(JSON.stringify(obj, null, 2));
    
    // 升级所有权限到Premium级别
    const premiumPermissions = {
      watchlist_limit: "UNLIMITED",
      watchlist_stock_limit: 100,
      chart_types: "UNLIMITED",
      chart_compare_limit: 4,
      chart_indicator_limit: "UNLIMITED",
      multi_chart_limit: "UNLIMITED",
      chartgame_review: true,
      chartgame_account_limit: 10,
      chartgame_freqs: "UNLIMITED",
      chartgame_free_step: 100,
      chartgame_free_reset_game_limit: 5,
      chartgame_pattern_filter: "UNLIMITED",
      chartgame_candle_count: 900,
      trading_note_count_limit: "UNLIMITED",
      special_stock_big_factor: "UNLIMITED",
      indicator_mining_stock_limit: 20,
      indicator_analysis_notification_limit: 100,
      indicator_analysis_config: true,
      financial_limit: 40,
      chart_prediction: true,
      membership_level: "alphasquare:premium",
      is_premium: true,
      expiration_date: "2099-12-31T23:59:59Z"
    };
    
    // 更新权限对象
    Object.assign(obj, premiumPermissions);
    
    // 更新策略权限
    obj.chart_strategy_roles = ["basic", "premium"];
    obj.chartgame_indicator_roles = ["basic", "premium"];
    obj.chartgame_strategy_roles = ["basic", "premium"];
    obj.indicator_mining_strategy_roles = ["basic", "premium"];
    obj.indicator_analysis_strategy_roles = ["basic", "premium"];
    
    // 更新股票类型权限
    obj.chartgame_stock_types = ["KR-STOCK", "KRW-CRYPTO", "USDT-CRYPTO", "US-STOCK"];
    obj.indicator_mining_stock_types = ["KR-STOCK", "US-STOCK", "CRYPTO"];
    obj.indicator_analysis_stock_type = ["KR-STOCK", "US-STOCK", "CRYPTO"];
    
    // 更新信号类型
    obj.indicator_mining_signal_types = ["BUY", "SELL", "HOLD"];
    
    // 添加额外特权
    obj.premium_features = {
      real_time_data: true,
      advanced_analytics: true,
      priority_support: true
    };
    
    // 生成新响应
    body = JSON.stringify(obj);
    
    // 调试日志
    console.log("修改后权限数据:");
    console.log(body);
    
    // 发送通知
    $notification.post(
      '🎉 Alphasquare 高级会员已激活', 
      '所有功能已解锁', 
      '您现在是Premium会员，有效期至2099-12-31'
    );
    
    $done({body});
    
  } catch (e) {
    console.log(`❌ 脚本执行错误: ${e}`);
    $notification.post('脚本执行失败', '请检查调试日志', e.message);
    $done({});
  }
} else {
  $done({});
}
