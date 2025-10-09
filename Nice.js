const isTask = typeof $task !== 'undefined';
const isHttpClient = typeof $httpClient !== 'undefined';

function createResponse() {
  const body = JSON.stringify({
     {
      premiumAccess: true,
      lifetime_subscription: true,
      store_subscription: true,
      subscription: true,
      subscriptionPlus: true,
      gems_balance: 9999,
      subscriptions: [
        {
          subscriptionId: "app.nicegram.pro.1month",
          id: 5,
          price: 3.99,
          isInApp: false,
          created_at: "2023-04-12T13:48:00.000000Z",
          platform: "ios",
          updated_at: "2025-11-28T12:30:32.000000Z",
          gems_price: 50,
          sandbox_gems_price: 1,
          isActive: 1
        },
        {
          subscriptionId: "app.nicegram.pro_plus.1month",
          id: 9,
          price: 9.99,
          isInApp: false,
          created_at: "2025-02-03T09:06:00.000000Z",
          platform: "ios",
          updated_at: "2025-11-10T09:00:49.000000Z",
          gems_price: 100,
          sandbox_gems_price: 1,
          isActive: 1
        }
      ],
      user: {
        id: 1083866,
        user_name: "Zefix777",
        first_name: "Zefix",
        last_name: "",
        gems_balance: 9999,
        subscription: true,
        subscriptionPlus: true,
        lifetime_subscription: true,
        store_subscription: true
      }
    }
  });
  return body;
}

if (isHttpClient) {
  console.log("\nNicegram Script Log:\nNicegram Premium 완전 해제됨 😎");
  $done({
    response: {
      status: 200,
      body: createResponse()
    }
  });
} else if (isTask) {
  console.log("\nNicegram Script Log:\nNicegram Premium 완전 해제됨 😎");
  $done({
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "application/json" },
    body: createResponse()
  });
} else {
  console.log("\nNicegram Script Log:\nNicegram Premium 완전 해제됨 😎");
  $done({
    status: 200,
    body: createResponse()
  });
}
