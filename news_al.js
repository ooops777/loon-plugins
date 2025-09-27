/*
 * Loon 스크립트: 사용자 설정 및 알림 권한 강제 활성화
 * 역할: 모든 알림 및 설정 필드를 true로 설정
 */

$done({
    body: JSON.stringify({
        "deviceId": "Loon_Device_ID", // 임의의 값 설정
        "userId": 16689,
        "breakingNewsNotificationSound": true,
        "breakingNewsNotificationCategory": {
            "1": true, "2": true, "3": true, "4": true, "5": true,
            "7": true, "8": true, "9": true, "10": true, "11": true,
            "12": true, "13": true, "14": true
        },
        "breakingNewsNotificationAll": true, // false -> true로 변경
        "breakingNewsNotificationPriority": true,
        "watchlistPodcast": true,
        "watchlistBreakingNews": true,
        "breakingNewsNotificationKeyword": true
    })
});
