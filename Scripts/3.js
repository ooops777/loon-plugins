/*
 * ===============================================
 * myduty 구독 활성화 스크립트
 * ===============================================
 */

function main() {
    try {
        const body = $response.body;
        let obj = JSON.parse(body);

        // 헤더 상태를 'success'로 변경하고 메시지를 제거
        if (obj.header) {
            obj.header.status = "success";
            obj.header.message = "SUBSCRIPTION_ACTIVE"; // 메시지도 성공 상태로 변경
        }

        // body가 존재하는지 확인 후 데이터 변경
        if (obj.body) {
            const now = new Date();
            const futureDate = new Date(now.setFullYear(now.getFullYear() + 50)); // 현재로부터 50년 후로 설정
            const futureDateISO = futureDate.toISOString();

            obj.body.expiresDate = futureDateISO;
            // 만료일이 현재보다 과거일 경우에만 업데이트
            if (new Date(obj.body.expiresDate) < new Date()) {
                 obj.body.expiresDate = futureDateISO;
            }

            console.log("✅ myduty 구독 만료일이 " + obj.body.expiresDate + "로 변경되었습니다.");
        }

        // 수정된 JSON을 문자열로 변환
        const modifiedBody = JSON.stringify(obj);
        
        // 최종 응답 반환
        $done({ body: modifiedBody });

    } catch (e) {
        console.error(`❌ 스크립트 실행 중 오류 발생: ${e.message}`);
        $done({});
    }
}

main();
