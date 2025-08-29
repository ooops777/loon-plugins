// Stocknow.ai Pro 구독 필요로 변경
let url = $request.url;
let body = $response.body;

if (url.includes("https://stocknow.ai/api/v1/feature-flags")) {
    try {
        // JSON 응답 본문을 객체로 파싱
        let obj = JSON.parse(body);
        
        // requireProSubscription 값을 false에서 true로 변경
        obj.requireProSubscription = true;
        
        // 필요시 다른 Pro 관련 설정도 변경 가능
        // obj.displayEarningsReportUnsupportBadge = true;
        // obj.requireProSubscriptionForTTS = true;
        
        // 수정된 JSON 객체를 다시 문자열로 변환합니다
        body = JSON.stringify(obj);
        
        console.log("requireProSubscription 값이 true로 변경되었습니다");
    } catch (error) {
        console.log("JSON 처리 오류: " + error);
    }
}

$done({body});
