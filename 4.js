let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // 모든 경우 잠금 해제
  data.unlocked = true;
  data.unlockedAt = "2099-12-31T23:59:59Z"; // 종료 시점은 필요에 따라 조정 가능
  data.expiresAt = null;
  data.transaction = null;
  data.unlockCost = null;

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
