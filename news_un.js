/*
 * Loon 스크립트: 제한 해제 및 시간 순서 유지 (V4 - items/unreadableCount 대응)
 * 유형: response-body
 * 적용 URL: ^https?:\/\/stocknow\.ai\/api\/breaking-news
 * 역할:
 * 1. "items" 배열 내 기사의 "isRestricted" 상태를 false로 변경합니다.
 * 2. 최상위 "unreadableCount"를 0으로 설정하여 미표시 기사 개수를 숨깁니다.
 * 3. 기사의 "publishedAt" 시간을 15분 이전으로 이동시켜 시간 순서를 유지합니다.
 */

$done({
    body: modifyNewsData($response.body)
});

function modifyNewsData(bodyStr) {
    try {
        const jsonBody = JSON.parse(bodyStr);
        let modificationCount = 0;
        
        // --- 시간 계산: 15분 30초 전을 기준 시간으로 설정 ---
        const currentTime = new Date();
        // 15분 30초 (15.5분) 전으로 기준 설정
        const referenceTime = new Date(currentTime.getTime() - (15.5 * 60 * 1000)); 
        // ----------------------------------------------------

        // 1. 뉴스 배열 찾기: 새로운 JSON 구조에 맞춰 'items' 키 우선 탐색
        let newsArray = [];
        if (typeof jsonBody === 'object' && jsonBody !== null && Array.isArray(jsonBody.items)) {
            newsArray = jsonBody.items;
        } else if (Array.isArray(jsonBody)) {
            // 호환성을 위해 루트 배열도 확인
            newsArray = jsonBody;
        } 
        // 필요 시 여기에 다른 중첩 구조(data, articles) 확인 로직을 추가할 수 있습니다.

        // 2. 항목(items) 수정: 제한 해제 및 시간 조정
        newsArray.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                
                // (1) 제한 해제: isRestricted -> false
                if ('isRestricted' in item && item.isRestricted === true) {
                    item.isRestricted = false;
                    modificationCount++;
                }
                
                // (2) 시간 조정: 15분 이상 과거로 시간 이동
                if ('publishedAt' in item) {
                    try {
                        const originalTime = new Date(item.publishedAt);
                        
                        // 현재 시간과 원래 시간의 차이 계산
                        const timeDifference = currentTime.getTime() - originalTime.getTime();
                        
                        // 새로운 시간 = 기준 시간 - (시간 차이) -> 기존 시간 순서를 유지하며 전체를 과거로 이동
                        const newTimeMs = referenceTime.getTime() - timeDifference;
                        const newTime = new Date(newTimeMs);
                        
                        item.publishedAt = newTime.toISOString();
                        
                    } catch (e) {
                        // 시간 파싱 오류 시 대비책: 15분 30초 전으로 강제 설정
                        item.publishedAt = referenceTime.toISOString();
                    }
                }
            }
        });
        
        // 3. 최상위 unreadableCount 수정
        if ('unreadableCount' in jsonBody) {
             jsonBody.unreadableCount = 0;
        }

        console.log(`[Loon Script] 총 ${modificationCount}개 항목의 제한을 해제하고 시간을 조정했습니다. UnreadableCount: 0.`);
        
        return JSON.stringify(jsonBody);

    } catch (e) {
        console.log(`[Loon Script Error] JSON 파싱 또는 수정 실패: ${e.message}`);
        return bodyStr;
    }
}
