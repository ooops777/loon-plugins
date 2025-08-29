// Stocknow.ai Pro 구독 필요로 변경
let url = $request.url;
let body = $response.body;

if (url.includes("https://stocknow.ai/api/v1/feature-flags")) {
    try {
        let obj = JSON.parse(body);
        obj.requireProSubscription = true;
        
        // 다른 Pro 관련 설정도 필요한 경우 변경 가능
        // obj.displayEarningsReportUnsupportBadge = true;
        // obj.requireProSubscriptionForTTS = true;
        
        body = JSON.stringify(obj);
    } catch (error) {
        console.log("JSON 파싱 오류: " + error);
    }
}

$done({body});
