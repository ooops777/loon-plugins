[Script]
# 알파스퀘어 차트 게임 지표 전체 활성화
# 이름: Alphasquare Chart Game Indicators Activator
# 설명: 차트 게임의 모든 지표를 선택된 상태로 설정하고 거래량 필요 여부 활성화
# 유형: http-response
# 활성: true
# 패턴: ^https?:\/\/api\.alphasquare\.co\.kr\/.*(chartgame|indicator).*

try {
    let body = $response.body;
    let obj = JSON.parse(body);
    
    console.log("알파스퀘어 차트 게임 지표 활성화 시작");
    
    // configs 배열 내의 모든 지표 수정
    if (obj.configs && Array.isArray(obj.configs)) {
        let modifiedCount = 0;
        
        obj.configs.forEach(indicator => {
            // is_selected를 true로 설정
            if (indicator.is_selected !== undefined) {
                indicator.is_selected = true;
            }
            
            // volume_required를 true로 설정
            if (indicator.volume_required !== undefined) {
                indicator.volume_required = true;
            }
            
            modifiedCount++;
            console.log(`지표 활성화: ${indicator.indicator || indicator.label}`);
        });
        
        console.log(`✅ 총 ${modifiedCount}개 지표가 활성화되었습니다`);
    }
    
    // 기본 게임 설정도 업그레이드 (선택사항)
    if (obj.chartgame_free_step !== undefined) {
        obj.chartgame_free_step = 100; // 무료 스텝 증가
    }
    
    if (obj.chartgame_candle_count !== undefined) {
        obj.chartgame_candle_count = 900; // 캔들 수 증가
    }
    
    if (obj.chartgame_account_limit !== undefined) {
        obj.chartgame_account_limit = 10; // 계정 제한 증가
    }
    
    body = JSON.stringify(obj);
    $done({body});
    
} catch (e) {
    console.log("차트 게임 지표 활성화 오류: " + e);
    $done({});
}
