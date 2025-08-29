// 스크립트 목적: API 응답에서 user_id와 product_id가 null인 경우 특정 값으로 변경합니다.

// 1. API 응답 본문을 가져옵니다.
let responseBody = $response.body;

try {
  // 2. 응답 본문을 JSON 객체로 변환합니다.
  let data = JSON.parse(responseBody);
  
  // 3. user_id가 null이거나 없으면 설정합니다.
  if (data.user_id === null || data.user_id === undefined) {
    data.user_id = "16677"; // 원하는 사용자 ID로 변경
  }
  
  // 4. product_id가 null이거나 없으면 설정합니다.
  if (data.product_id === null || data.product_id === undefined) {
    data.product_id = "ai.stocknow.subscription.pro.1month.001"; // 원하는 상품 ID로 변경
  }
  
  // 5. 만약 응답이 중첩된 구조라면 (예: data.result.user_id), 경로를 수정해야 합니다.
  // if (data.result && (data.result.user_id === null || data.result.user_id === undefined)) {
  //   data.result.user_id = "16677";
  // }
  
  // 6. 수정된 JSON 객체를 다시 문자열로 변환합니다.
  responseBody = JSON.stringify(data);

} catch (e) {
  // 7. JSON 파싱 또는 수정 중 오류가 발생하면 원래 응답을 그대로 반환합니다.
  console.log("JSON 처리 중 오류 발생:", e);
}

// 8. 수정이 완료된 최종 응답 본문을 반환하고 스크립트를 종료합니다.
$done({ body: responseBody });
