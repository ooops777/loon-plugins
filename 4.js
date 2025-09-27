let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  if (data.type === "BREAKING_NEWS") {
    // BREAKING_NEWS 항목 잠금 해제
    data.unlocked = true;
    data.unlockedAt = "2099-12-31T23:59:59Z";
    data.expiresAt = null;
    data.transaction = null;
    data.unlockCost = null;
    
    // 구독 정보 추가 (선택사항)
    if (!data.subscription) {
      data.subscription = {};
    }
    data.subscription.status = "PRO";
    data.subscription.productId = "ai.stocknow.subscription.pro.1month.001";
    data.subscription.expiresAt = "2099-12-31T23:59:59Z";
    data.subscription.autoRenewal = false;
    data.subscription.platform = "APPLE";
  }

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
