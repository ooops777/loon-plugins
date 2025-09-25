[Script]
# 알파스퀘어 완전한 권한 업그레이드
# 유형: http-response
# 패턴: ^https?:\/\/api\.alphasquare\.co\.kr\/user\/v1\/permissions

try {
    let obj = JSON.parse($response.body);
    
    console.log("🔓 알파스퀘어 완전 권한 해제 시작");
    
    // 1. 사용자 기본 정보 업그레이드
    obj.current_tier = "alphasquare:premium";
    obj.effective_tier = "alphasquare:premium";
    obj.is_premium = true;
    obj.is_pro = true;
    obj.has_full_access = true;
    
    // 2. 구독 정보 설정
    obj.subscription_info = {
        "plan": "premium",
        "status": "active",
        "billing_period": "lifetime",
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": "2099-12-31T23:59:59Z",
        "payment_method": "complimentary",
        "auto_renewal": false
    };
    
    // 3. 모든 기능 권한 활성화
    const allFeatures = [
        "chart_prediction", "indicator_analysis", "multi_chart", 
        "virtual_trading", "chart_game", "advanced_charts",
        "technical_analysis", "fundamental_analysis", "screener",
        "export_data", "api_access", "custom_indicators",
        "backtesting", "portfolio_analysis", "risk_management"
    ];
    
    allFeatures.forEach(feature => {
        obj[feature] = true;
        obj[feature + "_access"] = "full";
        obj[feature + "_limit"] = "unlimited";
    });
    
    // 4. 등급별 권한 통일 (모든 등급을 프리미엄으로)
    function upgradeAllTiers(data) {
        if (typeof data !== 'object') return;
        
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                if ('alphasquare:premium' in data[key]) {
                    const premiumVal = data[key]['alphasquare:premium'];
                    // 모든 등급을 프리미엄 값으로 설정
                    data[key]['alphasquare:basic'] = premiumVal;
                    data[key]['alphasquare:standard'] = premiumVal;
                    data[key]['alphasquare:pro'] = premiumVal;
                } else {
                    upgradeAllTiers(data[key]);
                }
            }
        }
    }
    
    upgradeAllTiers(obj);
    
    // 5. 제한 해제
    obj.limits = {
        "watchlists": 999,
        "charts": 999,
        "alerts": 999,
        "portfolios": 999,
        "screeners": 999,
        "exports": 9999
    };
    
    // 6. 추가 기능 플래그
    obj.feature_flags = {
        "beta_features": true,
        "early_access": true,
        "premium_content": true,
        "advanced_tools": true
    };
    
    console.log("✅ 알파스퀘어 모든 권한이 활성화되었습니다");
    $done({body: JSON.stringify(obj)});
    
} catch (e) {
    console.log("권한 업그레이드 오류: " + e);
    $done({});
}
