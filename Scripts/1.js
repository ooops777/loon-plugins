/*
 * ===============================================
 * AlphaSquare 프리미엄 회원 권한 잠금 해제 스크립트
 * 適用 대상: api.alphasquare.co.kr/user/v1/permissions
 * 최종 업데이트 날짜: 2025-08-16
 * 버전: v4.0 (사용자 JSON 기반 맞춤형)
 * ===============================================
 */

// 프리미엄 등급에 해당하는 모든 기능 및 값 정의
// 이 부분은 제공된 JSON 구조에 맞춰 최적화되었습니다.
const PREMIUM_PERMISSIONS = {
    // 차트 게임(ChartGame) 기능
    chartgame_review: true,
    chartgame_stock_types: "UNLIMITED",
    chartgame_freqs: "UNLIMITED",
    chartgame_candle_count: 900,
    chartgame_free_step: 100,
    chartgame_account_limit: 10,
    chartgame_pattern_filter: "UNLIMITED",
    chartgame_free_reset_game_limit: 5,
    chartgame_indicator_roles: ["basic", "premium"],
    chartgame_strategy_roles: ["basic", "premium"],
    
    // 트레이딩 및 분석
    trading_note_count_limit: "UNLIMITED",
    indicator_mining_strategy_roles: ["basic", "premium"],
    indicator_mining_stock_types: "UNLIMITED",
    indicator_mining_stock_limit: 20,
    indicator_mining_signal_types: ["BUY", "SELL"],
    indicator_analysis_config: true,
    indicator_analysis_strategy_roles: ["basic", "premium"],
    indicator_analysis_stock_type: "UNLIMITED",
    indicator_analysis_notification_limit: 100,
    
    // 차트 기능
    chart_types: "UNLIMITED",
    chart_indicator_limit: "UNLIMITED",
    chart_compare_limit: 4,
    chart_prediction: true,
    multi_chart_limit: "UNLIMITED",
    chart_strategy_roles: ["basic", "premium"],
    
    // 관심종목 및 기타
    watchlist_stock_limit: 100,
    watchlist_limit: "UNLIMITED",
    special_stock_big_factor: "UNLIMITED",
    financial_limit: 40
};

// 메인 함수
function main() {
    try {
        // 응답 본문 가져오기
        const body = $response.body;
        
        // JSON 파싱 시도 (안정성 확보)
        let obj = JSON.parse(body);

        console.log("✅ AlphaSquare 권한 스크립트 실행 시작.");
        
        // 제공된 JSON 데이터에 기반하여 프리미엄 권한을 덮어씌움
        for (const key in PREMIUM_PERMISSIONS) {
            // 현재 응답 JSON에 해당 키가 존재할 때만 값을 변경
            if (obj.hasOwnProperty(key)) {
                obj[key] = PREMIUM_PERMISSIONS[key];
                console.log(`- ${key} 권한을 ${JSON.stringify(PREMIUM_PERMISSIONS[key])}로 업데이트했습니다.`);
            } else {
                console.log(`- 경고: 응답에 ${key} 키가 없어 변경을 건너뜁니다.`);
            }
        }
        
        console.log("✨ 모든 프리미엄 권한 업데이트 완료.");
        
        // 수정된 객체를 다시 문자열로 변환
        const modifiedBody = JSON.stringify(obj);
        
        // 성공 알림 전송 (Loon/Quantumult X 등 지원)
        if (typeof $notification !== 'undefined') {
            $notification.post(
                '🎉 AlphaSquare 프리미엄 활성화',
                '모든 기능이 잠금 해제되었습니다.',
                '무제한 기능, AI 예측, 다양한 차트를 즐겨보세요.'
            );
        }
        
        // 최종 응답 반환
        $done({ body: modifiedBody });

    } catch (e) {
        // 오류 처리
        console.error(`❌ 스크립트 실행 중 오류 발생: ${e.message}`);
        
        // 오류 알림 전송
        if (typeof $notification !== 'undefined') {
            $notification.post(
                'AlphaSquare 스크립트 오류',
                '스크립트 실행에 실패했습니다.',
                `오류 내용: ${e.message}`
            );
        }

        // 원본 응답을 그대로 반환하여 앱이 멈추지 않도록 함
        $done({});
    }
}

// 스크립트 실행
main();
