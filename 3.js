// 스크립트 목적: 모든 AI 분석 항목을 잠금 해제 상태로 변경합니다.
// 1. API 응답 본문을 가져옵니다.
let responseBody = $response.body;

try {
  // 2. 응답 본문을 JSON 객체로 변환합니다.
  let data = JSON.parse(responseBody);
  
  // 3. 응답이 AI_ANALYSIS 타입인 경우에만 처리
  if (data.type === "AI_ANALYSIS") {
    // 4. 모든 항목을 잠금 해제 상태로 설정
    data.unlocked = true;
    data.unlockedAt = "2099-12-31T23:59:59Z"; // 매우 먼 미래 날짜로 설정
    data.expiresAt = null; // 만료일 없음
    data.transaction = null;
    data.unlockCost = null;
    
    // 5. 구독 정보가 있다면 PRO 구독자로 설정 (선택적)
    if (!data.subscription) {
      data.subscription = {};
    }
    data.subscription.status = "PRO";
    data.subscription.productId = "ai.stocknow.subscription.pro.1month.001";
    data.subscription.expiresAt = "2099-12-31T23:59:59Z";
    data.subscription.autoRenewal = false;
    data.subscription.platform = "APPLE";
  }

  // 6. 수정된 JSON 객체를 다시 문자열로 변환합니다.
  responseBody = JSON.stringify(data);

} catch (e) {
  // 7. JSON 파싱 또는 수정 중 오류가 발생하면 원래 응답을 그대로 반환합니다.
  console.log("JSON 처리 중 오류 발생:", e);
}

// 8. 수정이 완료된 최종 응답 본문을 반환하고 스크립트를 종료합니다.
$done({ body: responseBody });
