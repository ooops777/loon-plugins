// 스크립트 목적: breaking-news API 응답을 수정하여 모든 뉴스 항목의 제한을 해제합니다.
let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // items 배열이 있는 경우 처리
  if (data.items && Array.isArray(data.items)) {
    // 모든 항목의 제한 해제 및 내용 복원
    data.items.forEach(item => {
      item.isRestricted = false;
      
      // 제목과 내용이 비어있는 경우 더미 데이터로 채우기 (선택사항)
      if (!item.title) item.title = "중요 시장 뉴스";
      if (!item.content) item.content = "이 뉴스는 프리미엄 구독자에게 제공되는 중요 뉴스입니다.";
      if (!item.aiContent) item.aiContent = "AI 분석: 이 뉴스는 시장에 중요한 영향을 미칠 수 있는 주요 발표입니다.";
    });
    
    // 읽을 수 없는 항목 수를 0으로 설정
    data.unreadableCount = 0;
  }

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
