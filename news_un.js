/*
 * Loon 스크립트: 제한 해제 및 시간 순서 유지 (V3 - 최종)
 * 유형: response-body
 * 역할:
 * 1. 모든 항목의 "isRestricted" 상태를 false로 변경합니다.
 * 2. 각 항목의 "publishedAt" 시간을 현재 시간보다 15분 이상 이전으로 이동시켜,
 * 앱이 모든 기사를 표시하도록 하면서도 기존의 시간 순서를 유지합니다.
 */

$done({
    body: modifyNewsData($response.body)
});

function modifyNewsData(bodyStr) {
    try {
        const jsonBody = JSON.parse(bodyStr);
        let modificationCount = 0;
        
        // 현재 시간 (Date 객체)
        const currentTime = new Date();
        
        // 기준 시간: 현재 시간보다 15분 30초 전을 기준으로 설정합니다.
        // 모든 기사는 이 기준 시간 이전에 발표된 것으로 간주됩니다.
        const referenceTime = new Date(currentTime.getTime() - (15.5 * 60 * 1000)); 
        
        // ----------------------------------------------------
        // 1단계: 뉴스 배열 찾기 (V2 스크립트와 동일)
        let newsArray = [];
        if (Array.isArray(jsonBody)) {
            newsArray = jsonBody;
        } else if (typeof jsonBody === 'object' && jsonBody !== null) {
            if (Array.isArray(jsonBody.data)) {
                newsArray = jsonBody.data;
            } else if (Array.isArray(jsonBody.articles)) {
                newsArray = jsonBody.articles;
            } else if (Array.isArray(jsonBody.list)) {
                newsArray = jsonBody.list;
            }
        }
        // ----------------------------------------------------

        newsArray.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                
                // 1. 제한 해제
                if ('isRestricted' in item && item.isRestricted === true) {
                    item.isRestricted = false;
                    modificationCount++;
                }
                
                // 2. 시간 조정 (Time Shifting)
                if ('publishedAt' in item) {
                    try {
                        const originalTime = new Date(item.publishedAt);
                        
                        // 현재 시간과 원래 시간의 차이를 계산 (미래 시간일 경우 음수가 됨)
                        const timeDifference = currentTime.getTime() - originalTime.getTime();
                        
                        // 새로운 시간 = 기준 시간 - (현재 시간과 원래 시간의 차이)
                        // 이 공식은 다음과 같이 작동합니다:
                        // - 원래 시간이 미래(2025년)이면: 이 차이만큼 시간이 더 과거로 이동됩니다.
                        // - 원래 시간이 과거(1시간 전)이면: 이 차이만큼 시간이 과거로 유지됩니다.
                        
                        // 예시: 
                        // 원래 시간: 2025-09-27 11:00 (현재보다 미래)
                        // 기준 시간: 2024-10-24 10:20 (현재보다 15분 전)
                        // 새로운 시간은 항상 기준 시간보다 과거에 위치하게 됩니다.
                        
                        const newTimeMs = referenceTime.getTime() - timeDifference;
                        const newTime = new Date(newTimeMs);
                        
                        // ISO 8601 형식의 UTC 문자열로 변경
                        item.publishedAt = newTime.toISOString();
                        
                    } catch (e) {
                        // 시간 파싱 오류 시 15분 전으로 강제 설정 (예비 동작)
                        item.publishedAt = referenceTime.toISOString();
                        console.log(`[Loon Script] 시간 파싱 오류. ${item.id} 시간을 강제로 15분 30초 전으로 설정.`);
                    }
                }
            }
        });

        console.log(`[Loon Script] 총 ${modificationCount}개 항목의 제한을 해제하고 시간을 조정했습니다.`);
        return JSON.stringify(jsonBody);

    } catch (e) {
        console.log(`[Loon Script Error] JSON 파싱 또는 수정 실패: ${e.message}`);
        return bodyStr;
    }
}
