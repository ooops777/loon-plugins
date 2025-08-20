// 스크립트 목적: API 응답을 수정하여 유료 멤버십 상태를 무조건 'PRO'로 변경하고,
// 특정 상품 ID를 부여한 후, 만료일을 넉넉한 미래 날짜로 설정합니다.

// 1. API 응답 본문을 가져옵니다.
let responseBody = $response.body;

try {
  // 2. 응답 본문을 JSON 객체로 변환합니다.
  let data = JSON.parse(responseBody);
  
  // 3. 'subscription' 객체가 없으면 새로 생성합니다.
  if (data.subscription === null) {
    data.subscription = {};
  }
  
  // 4. 'subscription' 객체에 접근하여 'status', 'productId', 'expiresAt' 등을 수정합니다.
  data.subscription.status = "PRO";
  data.subscription.productId = "ai.stocknow.subscription.pro.1month.001";
  data.subscription.expiresAt = "2099-12-31T23:59:59Z";
  
  // 5. (선택사항) 자동 갱신 여부를 'true'로 변경하여 지속성을 더합니다.
  data.subscription.autoRenewal = false;
  
  // 6. 수정된 JSON 객체를 다시 문자열로 변환합니다.
  responseBody = JSON.stringify(data);

} catch (e) {
  // 7. JSON 파싱 또는 수정 중 오류가 발생하면 원래 응답을 그대로 반환합니다.
  console.log("JSON 파싱 오류:", e);
}

// 8. 수정이 완료된 최종 응답 본문을 반환하고 스크립트를 종료합니다.
$done({ body: responseBody });
