/*
 * Loon Response Body Rewrite Script - 모든 인사이트 무료화 (개선된 버전)
 * 목표: 응답 JSON 내에 포함된 모든 인사이트 객체(id 속성을 가진 객체)의 
 * "isFree" 속성을 ID에 관계없이 true로 강제 변경합니다.
 * 적용 URL: ^https?:\/\/stocknow\.ai\/api\/spark-insights\/.*
 */

function body(data) {
    let responseBody;
    try {
        // 응답 본문을 JSON 객체로 안전하게 파싱합니다.
        responseBody = JSON.parse(data);
    } catch (e) {
        console.error("[Loon Script] JSON 파싱 오류:", e.message);
        return data; // 파싱 실패 시 원본 데이터 그대로 반환
    }

    // Insight 객체를 무료로 설정하는 핵심 함수
    const setInsightFree = (item) => {
        // 유효한 객체이며 'id'와 'isFree' 속성을 가지고 있을 경우 Insight로 간주
        if (item && typeof item.id === 'number' && typeof item.isFree === 'boolean') {
            if (item.isFree === false) {
                console.log(`[Loon Script] ID ${item.id}의 isFree를 false에서 true로 수정했습니다.`);
            }
            item.isFree = true;
        }
    };

    // 응답 본문을 순회하며 Insight 객체를 찾고 수정하는 함수
    const traverseAndModify = (obj) => {
        if (!obj || typeof obj !== 'object') return;

        // 1. 현재 객체 자체가 Insight 객체인지 확인하고 수정
        setInsightFree(obj);

        // 2. 현재 객체의 속성들을 순회
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                
                if (Array.isArray(value)) {
                    // 3. 값이 배열인 경우 (예: Insights 목록)
                    value.forEach(item => {
                        traverseAndModify(item); // 배열 요소 순회
                    });
                } else if (typeof value === 'object' && value !== null) {
                    // 4. 값이 객체인 경우 (예: { data: { id: ... } } 또는 중첩된 객체)
                    traverseAndModify(value); // 재귀적으로 탐색
                }
            }
        }
    };

    // 수정 로직 실행
    traverseAndModify(responseBody);
    
    // 수정된 JSON 객체를 다시 문자열로 직렬화하여 반환
    return JSON.stringify(responseBody);
}
