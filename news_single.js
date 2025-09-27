/* 단일 기사 수정 스크립트 (V5) */
$done({body: modifySingleNews($response.body)});

function modifySingleNews(bodyStr) {
    try {
        const jsonBody = JSON.parse(bodyStr);
        const pastUtc = new Date(new Date().getTime() - (15.5 * 60 * 1000)).toISOString(); 

        if (typeof jsonBody === 'object' && jsonBody !== null) {
            if ('isRestricted' in jsonBody && jsonBody.isRestricted === true) {
                jsonBody.isRestricted = false;
                console.log("[Loon Script] 단일 기사 제한 해제 성공.");
            }
            if ('publishedAt' in jsonBody) {
                jsonBody.publishedAt = pastUtc;
            }
            return JSON.stringify(jsonBody);
        }
        return bodyStr;
    } catch (e) {
        console.log(`[Loon Script Error] 단일 기사 파싱 실패: ${e.message}`);
        return bodyStr;
    }
}
