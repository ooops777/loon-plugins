let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // isFree 값을 true로 변경
  data.isFree = true;
  
  // isRestricted 값을 false로 변경
  data.isRestricted = false;

  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("JSON 처리 중 오류 발생:", e);
}

$done({ body: responseBody });
