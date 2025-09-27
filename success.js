/*
 * Loon 스크립트: 크레딧 차감 우회 (V6)
 * 역할: 잠금 해제 API 요청 시 강제 성공 응답 반환
 */
$done({
    body: JSON.stringify({
        "success": true,
        "message": "PRO 구독으로\n데일리 인사이트 내용이 잠금 해제되었습니다.",
        "errorCode": null
    })
});
