[Script]
# 인벤토리 아이템 수량 9999개로 고정
# 유형: http-response
# 패턴: ^https?:\/\/api\.yourgame\.com\/inventory$

try {
    let obj = JSON.parse($response.body);

    console.log("🔧 인벤토리 수량 변조 시작");

    // 수량 조작: 모든 품목 9999개로 설정
    if (obj.Inventory) {
        obj.Inventory.Ammonite = 9999;
        obj.Inventory.Bone = 9999;
        obj.Inventory.CollectionEggSelection = 9999;
        obj.Inventory.LootFastMoveTicket = 9999;
        obj.Inventory.Metal = 9999;
        obj.Inventory.BestHunterCoin = 9999;
        obj.Inventory.Thatch = 9999;
        obj.Inventory.Hide = 9999;
        obj.Inventory.Pheromone = 9999;
        obj.Inventory.GoldTicket = 9999;
        obj.Inventory.CoolTimeFever = 9999;
        obj.Inventory.Claw = 9999;
        obj.Inventory.LootRefreshTicket = 9999;
        obj.Inventory.MutationRateFever = 9999;
    }

    console.log("✅ 인벤토리 모든 품목 수량이 9999로 조작됨");
    $done({body: JSON.stringify(obj)});

} catch(e) {
    console.log("인벤토리 수량 변조 오류: " + e);
    $done({});
}
