// 쇼핑몰 사용자 정보 변조 스크립트 (VIP 등급)
let responseBody = $response.body;

try {
  let data = JSON.parse(responseBody);
  
  // 마일리지 정보 변조 (VIP 등급에 맞게)
  if (data.Mileage) {
    data.Mileage.avail_mileage = "500000.00"; // VIP 등급에 적합한 마일리지
    data.Mileage.total_mileage = 500000;
  }
  
  // 예치금 정보 변조
  if (data.Deposit) {
    data.Deposit.all_deposit = 100000; // VIP 등급에 적합한 예치금
    data.Deposit.total_deposit = 100000;
  }
  
  // 회원 등급 및 혜택 변조 (VIP 등급으로)
  if (data.Benefit) {
    // VIP 등급 이미지로 변경 (실제 경로는 해당 쇼핑몰에 맞게 수정 필요)
    data.Benefit.group_image = "//m.ndns.shop/web/upload/mg_img_VIP.png";
    data.Benefit.group_icon = "//m.ndns.shop/web/bbs_member_icon/member/vip_icon.png";
    
    // VIP 등급에 적합한 할인 혜택 추가
    data.Benefit.use_dc = "10% 추가할인";
    data.Benefit.mobile_use_dc = "10% 추가할인";
    data.Benefit.dc_price = "10000원";
    data.Benefit.dc_max_percent = "10";
    
    // 추가 VIP 혜택 설정
    data.Benefit.ship_free_message = "VIP 무료배송";
    data.Benefit.dc_min_price = "0원 이상"; // 무조건 할인 적용
  }
  
  responseBody = JSON.stringify(data);
} catch (e) {
  console.log("VIP 등급 변조 중 오류 발생:", e);
}

$done({body: responseBody});
