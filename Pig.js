// API 응답에서 body 데이터 추출
let body = $response.body;
if (!body) return $done({});

try {
    // JSON 파싱
    let obj = JSON.parse(body);
    let data = JSON.parse(obj.data.payload);
    
    // 프리미엄 기능 활성화
    data.expires = 999999; // 만료일자를 먼 미래로 설정
    
    // 다양한 프리미엄 플래그 활성화
    [
        'isVIP',           // VIP 여부
        'isPremium',       // 프리미엄 여부  
        'isValid',         // 유효성
        'isActivated',     // 활성화 여부
        'isTrial',         // trial 기간
        'isSubscribed',    // 구독 여부
        'hasLicense',      // 라이선스 보유
        'isVerified',      // 인증 여부
        'isAuthorized',    // 권한 부여
        'isUnlocked'       // 잠금 해제
    ].forEach(key => data[key] = true);
    
    // 광고 관련 필드 제거 또는 비활성화
    [
        'adsEnabled',
        'showAds', 
        'hasAds',
        'adSupported'
    ].forEach(key => {
        if (typeof data[key] === 'boolean') 
            data[key] = false;
    });
    
    // payload 데이터 정리 (광고 제거)
    if (data.payload) {
        let payloadArray = data.payload.split(',');
        data.payload = payloadArray.slice(1, -1).join(',');
    }
    
    // 수정된 데이터로 응답 재구성
    obj.data.payload = JSON.stringify(data);
    body = JSON.stringify(obj);
    
} catch (error) {
    console.log('Error modifying response: ' + error);
}

// 수정된 응답 반환
$done({body});
