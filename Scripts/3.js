/*
 * ===============================================
 * AlphaSquare 영구 구독 활성화 스크립트
 * 適用 대상: 특정 영수증 유효성 검사 API (예: revenuecat)
 * 최종 업데이트 날짜: 2025-08-16
 * 버전: v1.0 (영수증 데이터 기반)
 * ===============================================
 */

// 영구 구독 활성화를 위한 값 정의
const LIFETIME_SUBSCRIPTION = {
    expires_date: "2099-12-31 23:59:59 Etc/GMT",
    expires_date_pst: "2099-12-31 15:59:59 America/Los_Angeles",
    expires_date_ms: "4102444799000", // 2099-12-31 23:59:59 UTC에 해당하는 밀리초 값
    is_in_intro_offer_period: "false",
    is_trial_period: "false",
    // 기타 필요한 플래그를 추가할 수 있음
    is_lifetime: true
};

// 메인 함수
function main() {
    try {
        const body = $response.body;
        let obj = JSON.parse(body);

        // 응답이 유효한지 확인
        if (obj && obj.data && obj.data.transaction) {
            console.log("✅ AlphaSquare 영수증 스크립트 실행 시작.");

            // 거래 객체에 접근
            let transaction = obj.data.transaction;

            // 영구 구독 값으로 덮어씌움
            for (const key in LIFETIME_SUBSCRIPTION) {
                if (transaction.hasOwnProperty(key)) {
                    transaction[key] = LIFETIME_SUBSCRIPTION[key];
                    console.log(`- transaction.${key} 값을 ${LIFETIME_SUBSCRIPTION[key]}로 변경했습니다.`);
                }
            }

            // 추가적인 영구 구독 속성 삽입
            transaction.is_lifetime = true;

            console.log("✨ 영구 구독 활성화 완료.");

            // 수정된 객체를 다시 문자열로 변환
            const modifiedBody = JSON.stringify(obj);

            // 성공 알림 전송
            if (typeof $notification !== 'undefined') {
                $notification.post(
                    '🎉 AlphaSquare 영구 구독 활성화',
                    '구독 만료일이 2099년으로 변경되었습니다.',
                    '무료 체험 기간이 종료되지 않고 영구적으로 사용 가능합니다.'
                );
            }

            // 최종 응답 반환
            $done({ body: modifiedBody });

        } else {
            // 응답 구조가 예상과 다른 경우
            console.log("⚠️ 예상치 못한 응답 구조입니다. 스크립트가 작동하지 않았습니다.");
            $done({});
        }

    } catch (e) {
        // 오류 처리
        console.error(`❌ 스크립트 실행 중 오류 발생: ${e.message}`);
        if (typeof $notification !== 'undefined') {
            $notification.post(
                'AlphaSquare 스크립트 오류',
                '영구 구독 스크립트 실행에 실패했습니다.',
                `오류 내용: ${e.message}`
            );
        }
        // 원본 응답을 그대로 반환
        $done({});
    }
}

// 스크립트 실행
main();
