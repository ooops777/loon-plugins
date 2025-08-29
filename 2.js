// API 응답 수정: 유료 멤버십 상태를 PRO로 변경 및 만료일 연장
(function() {
    'use strict';
    
    // 1. 설정 값 상수화 (쉽게 수정할 수 있도록)
    const CONFIG = {
        SUBSCRIPTION_STATUS: "PRO",
        PRODUCT_ID: "ai.stocknow.subscription.pro.1month.012",
        EXPIRATION_DATE: "2099-12-31T23:59:59Z",
        AUTO_RENEWAL: false,
        PLATFORM: "APPLE",
        SUBSCRIPTION_FIELD: "subscription" // 구독 정보가 있는 필드명
    };
    
    // 2. 응답 본문 가져오기
    let responseBody = $response.body;
    if (!responseBody) {
        console.log("응답 본문이 비어 있습니다.");
        $done({});
        return;
    }
    
    try {
        // 3. JSON 파싱
        let data = JSON.parse(responseBody);
        
        // 4. 구독 객체 생성 또는 확보
        if (!data[CONFIG.SUBSCRIPTION_FIELD] || typeof data[CONFIG.SUBSCRIPTION_FIELD] !== 'object') {
            data[CONFIG.SUBSCRIPTION_FIELD] = {};
        }
        
        let subscription = data[CONFIG.SUBSCRIPTION_FIELD];
        
        // 5. 구독 정보 설정
        subscription.status = CONFIG.SUBSCRIPTION_STATUS;
        subscription.productId = CONFIG.PRODUCT_ID;
        subscription.expiresAt = CONFIG.EXPIRATION_DATE;
        subscription.autoRenewal = CONFIG.AUTO_RENEWAL;
        subscription.platform = CONFIG.PLATFORM;
        
        // 6. JSON 문자열로 변환
        responseBody = JSON.stringify(data);
        
    } catch (e) {
        // 7. 오류 처리
        console.log("JSON 처리 중 오류 발생: " + e.message);
        // 오류 발생 시 원본 응답 유지
    }
    
    // 8. 수정된 응답 반환
    $done({ body: responseBody });
})();
