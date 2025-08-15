// ==================================================
// Alphasquare 预测功能权限修复脚本
// 针对路径: api.alphasquare.co.kr/chart/v1/prediction
// 解决错误: CHART_PREDICTION_PERMISSION_DENIED
// ==================================================

if (typeof $request !== 'undefined') {
  const url = $request.url;
  const method = $request.method;
  
  // 1. 处理权限API响应
  if (method === 'GET' && url.includes('/user/v1/permissions')) {
    try {
      let body = $response.body;
      let obj = JSON.parse(body);
      
      // 添加预测功能权限
      obj.chart_prediction = true;
      obj.prediction_access = {
        enabled: true,
        level: "premium",
        expires: "2099-12-31T23:59:59Z"
      };
      
      // 添加预测功能需要的特殊权限
      obj.prediction_settings = {
        max_days: 365,
        resolution: ["1d", "4h", "1h"],
        indicators: ["RSI", "MACD", "Bollinger"]
      };
      
      body = JSON.stringify(obj);
      console.log("预测权限已添加到主权限API");
      $done({body});
      
    } catch(e) {
      console.log("主权限API处理错误: "+e);
      $done({});
    }
  }
  // 2. 处理预测功能API
  else if (url.includes('/chart/v1/prediction')) {
    // 处理预测权限检查
    if (url.includes('/permission') || url.includes('/access')) {
      $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
          has_access: true,
          access_level: "premium",
          expires_at: "2099-12-31T23:59:59"
        })
      });
    }
    // 处理预测结果请求
    else if (url.includes('/calculate')) {
      // 创建模拟预测数据
      const predictionData = {
        success: true,
        prediction: [
          { date: "2025-08-16", price: 152.3, confidence: 0.85 },
          { date: "2025-08-17", price: 154.1, confidence: 0.82 },
          { date: "2025-08-18", price: 156.7, confidence: 0.78 }
        ],
        indicators: {
          RSI: "neutral",
          MACD: "bullish",
          Bollinger: "volatility_increase"
        }
      };
      
      $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify(predictionData)
      });
    }
    // 其他预测请求
    else {
      $done({});
    }
  }
  // 3. 处理权限拒绝错误
  else if ($response.status === 403 && $response.body.includes("CHART_PREDICTION_PERMISSION_DENIED")) {
    console.log("检测到预测权限拒绝错误，强制覆盖");
    
    $done({
      status: 200,
      headers: $response.headers,
      body: JSON.stringify({
        code: "SUCCESS",
        message: "Permission granted",
        access_token: "premium_unlock_"+Date.now()
      })
    });
  }
  // 其他请求
  else {
    $done({});
  }
}
