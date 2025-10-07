// API 응답 변조 스크립트
if ($response && $response.body) {
    try {
        let body = JSON.parse($response.body);
        
        if (body.data && body.data.game_info) {
            let gameInfo = JSON.parse(body.data.game_info);
            
            // 💰 경제 시스템 강화
            gameInfo.Coin = 999999;                    // 코인 최대치
            gameInfo.getCoin_achieve = 9999;           // 코인 획득 업적
            
            // 🎯 레벨 최대치 설정
            gameInfo.CheckLv = 99;
            gameInfo.pig_road_CheckLv = 99;
            gameInfo.inPigsty_CheckLv = 99;
            gameInfo.pig_ranch_CheckLv = 99;
            
            // ⭐ 업적 시스템 최대치
            gameInfo.achieveScore = 999;
            gameInfo.pigMove_achieve = 9999;
            gameInfo.duidui_achieve = 99;
            gameInfo.goodSort_achieve = 99;
            gameInfo.twit_achieve = 99;
            
            // 🎨 모든 스킨 해제 (가정: 0-50까지 모든 스킨)
            let allSkins = [];
            for (let i = 0; i <= 50; i++) {
                allSkins.push(i.toString());
            }
            gameInfo.SkinHad = allSkins.join(",");
            gameInfo.SkinChoice = "50"; // 최고급 스킨 선택
            
            // 🐷 모든 꼬리 아이템 해제
            let allTails = [];
            for (let i = 0; i <= 30; i++) {
                allTails.push(i.toString());
            }
            gameInfo.TailHad = allTails.join(",");
            
            // 🔄 모든 모델 활성화 보장
            gameInfo.duiduiModel = true;
            gameInfo.goodSortModel = true;
            gameInfo.twitModel = true;
            gameInfo.pigRunModel = true;
            gameInfo.InPigstyModel = true;
            
            // 수정된 game_info를 문자열로 다시 변환
            body.data.game_info = JSON.stringify(gameInfo);
            
            // 최종 응답 재구성
            $done({body: JSON.stringify(body)});
        } else {
            $done({});
        }
    } catch (error) {
        console.log("게임 데이터 변조 실패: " + error);
        $done({});
    }
} else {
    $done({});
}
