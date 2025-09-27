/* 뉴스 목록 수정 스크립트 (V4) */
$done({body: modifyNewsData($response.body)});

function modifyNewsData(bodyStr) {
    try {
        const jsonBody = JSON.parse(bodyStr);
        const currentTime = new Date();
        const referenceTime = new Date(currentTime.getTime() - (15.5 * 60 * 1000)); 
        const newsArray = (jsonBody && Array.isArray(jsonBody.items)) ? jsonBody.items : [];
        let modificationCount = 0;

        newsArray.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                if ('isRestricted' in item && item.isRestricted === true) {
                    item.isRestricted = false;
                    modificationCount++;
                }
                if ('publishedAt' in item) {
                    try {
                        const originalTime = new Date(item.publishedAt);
                        const timeDifference = currentTime.getTime() - originalTime.getTime();
                        const newTimeMs = referenceTime.getTime() - timeDifference;
                        item.publishedAt = new Date(newTimeMs).toISOString();
                    } catch (e) {}
                }
            }
        });
        
        if ('unreadableCount' in jsonBody) {
             jsonBody.unreadableCount = 0;
        }

        console.log(`[Loon Script] 목록 수정 완료: ${modificationCount}건`);
        return JSON.stringify(jsonBody);
    } catch (e) {
        console.log(`[Loon Script Error] 목록 파싱 실패: ${e.message}`);
        return bodyStr;
    }
}
