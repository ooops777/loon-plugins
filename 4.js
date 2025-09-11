// 스크립트 목적: 개별 breaking-news 상세 API 응답을 수정하여 뉴스 항목의 제한을 해제합니다.
let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // 400 오류 응답인지 확인
  if (data.error && data.error.includes("not found")) {
    // 오류 응답을 가짜 뉴스 항목으로 대체
    // URL에서 ID 추출 (예: https://stocknow.ai/api/breaking-news/18552)
    let url = $request.url;
    let newsId = url.match(/breaking-news\/(\d+)/)[1];
    
    data = {
      id: parseInt(newsId),
      title: "중요 시장 뉴스",
      content: "이 뉴스는 프리미엄 구독자에게 제공되는 중요 뉴스입니다.",
      originalTitle: "Important Market News",
      originalContent: "This news is provided to premium subscribers.",
      aiContent: "AI 분석: 이 뉴스는 시장에 중요한 영향을 미칠 수 있는 주요 발표입니다.",
      reference: "StockNow",
      source: "StockNow",
      publishedAt: new Date().toISOString(),
      isImportant: true,
      isTrending: true,
      categoryId: 1,
      categoryName: "시장뉴스",
      actions: {
        fire: {
          count: 0,
          enabled: false
        }
      },
      tickers: null,
      isScraped: false,
      scrapCount: 0,
      isRestricted: false
    };
  } else {
    // 정상 응답인 경우 제한 해제
    data.isRestricted = true;
    
    // 제목과 내용이 비어있는 경우 더미 데이터로 채우기
    if (!data.title || data.title === "") data.title = "중요 시장 뉴스";
    if (!data.content || data.content === "") data.content = "이 뉴스는 프리미엄 구독자에게 제공되는 중요 뉴스입니다.";
    if (!data.aiContent || data.aiContent === "") data.aiContent = "AI 분석: 이 뉴스는 시장에 중요한 영향을 미칠 수 있는 주요 발표입니다.";
  }

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
