[Script]
# 알파스�어 특정 지표들만 활성화
# 유형: http-response
# 패턴: ^https?:\/\/api\.alphasquare\.co\.kr\/indicator-analysis\/v2\/configs

try {
    let obj = JSON.parse($response.body);
    
    // 활성화할 지표 이름 목록 (필요에 따라 수정)
    const targetIndicators = [
        "전태룡직장인",
        "전태룡급등",
    ];
    
    function activateSpecificIndicators(data) {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item && item.indicator && targetIndicators.includes(item.indicator)) {
                    item.is_selected = true;
                    item.volume_required = true;
                    console.log(`활성화: ${item.indicator}`);
                }
            });
        } else if (typeof data === 'object') {
            for (let key in data) {
                if (Array.isArray(data[key])) {
                    activateSpecificIndicators(data[key]);
                }
            }
        }
    }
    
    activateSpecificIndicators(obj);
    $done({body: JSON.stringify(obj)});
    
} catch (e) {
    console.log("지표 활성화 오류: " + e);
    $done({});
}
