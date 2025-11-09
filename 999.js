let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);

  if (!data.body) data.body = {};
  if (!data.body.user) data.body.user = {};

  // subscription 객체가 없으면 새 생성, 있으면 병합
  data.body.user.subscription = Object.assign({}, data.body.user.subscription || {}, {
    "status": "ACTIVE",
    "active": true,
    "subscriptionId": "myduty_premium",
    "productId": "myduty_premium_monthly",
    "platform": "AppStore",
    "renewProductId": "myduty_premium_monthly",
    "promotion": null,
    "expiresDate": "2025-11-18T01:38:47Z",
    "trial": false,
    "resumeDate": null
  });

  responseBody = JSON.stringify(data);

} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
