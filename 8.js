[Script]
# 알파스퀘어 지능형 권한 업그레이드
# 유형: http-response
# 패턴: ^https?:\/\/api\.alphasquare\.co\.kr\/user\/v1\/permissions

try {
    let obj = JSON.parse($response.body);
    
    console.log("🧠 알파스퀘어 지능형 권한 업그레이드 시작");
    
    // 값 타입에 따른 업그레이드 전략
    function upgradeValue(key, currentValue) {
        switch (typeof currentValue) {
            case 'number':
                // 숫자인 경우 큰 값으로 업그레이드
                if (key.includes('limit') || key.includes('count')) {
                    return currentValue < 10 ? 999 : currentValue * 10;
                }
                return currentValue * 2;
                
            case 'boolean':
                // 불리언인 경우 항상 true
                return true;
                
            case 'object':
                if (Array.isArray(currentValue)) {
                    // 배열인 경우 확장 또는 "UNLIMITED"
                    if (key.includes('types') || key.includes('roles')) {
                        if (currentValue.length <= 2) {
                            return ["basic", "premium", "advanced"];
                        }
                    }
                    return "UNLIMITED";
                }
                return currentValue;
                
            default:
                return currentValue;
        }
    }
    
    // 모든 필드 업그레이드
    for (let key in obj) {
        const oldValue = obj[key];
        obj[key] = upgradeValue(key, oldValue);
        
        if (oldValue !== obj[key]) {
            console.log(`🔓 ${key}: ${JSON.stringify(oldValue)} → ${JSON.stringify(obj[key])}`);
        }
    }
    
    // 특수 케이스 추가 처리
    obj.chart_prediction = true;
    obj.indicator_analysis_config = true;
    obj.virtual_trading_permanent_account = true;
    
    console.log("✅ 알파스퀘어 권한 업그레이드 완료");
    $done({body: JSON.stringify(obj)});
    
} catch (e) {
    console.log("업그레이드 오류: " + e);
    $done({});
}
