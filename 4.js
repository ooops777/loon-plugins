let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // 잠금 해제 상태는 유지하고 만료일만 null로 설정
  data.unlocked = true;
  data.expiresAt = null;
  
  // 다른 관련 필드도 유지 또는 초기화
  if (!data.unlockedAt) {
    data.unlockedAt = "2099-12-31T23:59:59Z";  // 기존처럼 해제 시점 지정 가능
  }
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

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
