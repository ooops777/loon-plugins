/*
 * ===============================================
 * myduty 사용자 정보 프리미엄 활성화 스크립트
 * 適用 대상: myduty 앱의 사용자 정보 API (예상 경로)
 * 업데이트 날짜: 2025-08-16
 * ===============================================
 */

// 프리미엄 사용자 정보로 변경할 값 정의
const PREMIUM_USER_DATA = {
    // 사용자 등급을 PREMIUM으로 변경
    level: "PREMIUM", 
    
    // 각종 제한 해제
    limit: {
        dutyUnit: 9999,
        hamster: 9999,
        group: 9999
    },
    
    // 구독 정보 추가 (프리미엄으로 보이게)
    subscription: {
        expiresDate: "2099-12-31T23:59:59Z",
        subscriptionId: "myduty_premium",
        productId: "myduty_premium_lifetime",
        purchaseDate: "2025-08-16T13:30:28Z" // 스크립트 실행 날짜로 설정
    }
};

// 메인 함수
function main() {
    try {
        const body = $response.body;
        let obj = JSON.parse(body);

        console.log("✅ myduty 사용자 정보 스크립트 실행 시작.");

        // `body` 객체가 존재하고 `user` 객체가 그 안에 있는지 확인
        if (obj && obj.body && obj.body.user) {
            let user = obj.body.user;

            // `PREMIUM_USER_DATA`의 모든 키를 순회하며 `user` 객체에 적용
            for (const key in PREMIUM_USER_DATA) {
                user[key] = PREMIUM_USER_DATA[key];
                console.log(`- user.${key} 권한을 ${JSON.stringify(PREMIUM_USER_DATA[key])}로 업데이트했습니다.`);
            }

            console.log("✨ 사용자 정보 프리미엄 업데이트 완료.");

            const modifiedBody = JSON.stringify(obj);

            // 성공 알림 전송
            if (typeof $notification !== 'undefined') {
                $notification.post(
                    '🎉 myduty 프리미엄 활성화',
                    '사용자 등급이 프리미엄으로 변경되었습니다.',
                    '무제한 근무표, 그룹 생성 등의 기능을 즐겨보세요.'
                );
            }

            $done({ body: modifiedBody });

        } else {
            console.log("⚠️ 예상치 못한 응답 구조입니다. 스크립트가 작동하지 않았습니다.");
            $done({});
        }

    } catch (e) {
        console.error(`❌ 스크립트 실행 중 오류 발생: ${e.message}`);
        $done({});
    }
}

// 스크립트 실행
main();
