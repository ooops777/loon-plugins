[MITM]
hostname = api.flysheeep.com

[Script]
enable = true
type = http-response
pattern = ^https?://api\.flysheeep\.com/api/expro/get_pig_game_info
requires-body = true
script = function(request, response)
    if response.status == 200 then
        local body = response.body
        local json = JSON:parse(body)
        
        if json and json.data and json.data.game_info then
            local gameInfo = JSON:parse(json.data.game_info)
            
            -- 🎮 게임 데이터 변조
            gameInfo.Coin = 999999
            gameInfo.CheckLv = 99
            gameInfo.pig_road_CheckLv = 99
            gameInfo.inPigsty_CheckLv = 99
            gameInfo.pig_ranch_CheckLv = 99
            gameInfo.achieveScore = 999
            gameInfo.pigMove_achieve = 9999
            gameInfo.getCoin_achieve = 9999
            gameInfo.duidui_achieve = 99
            gameInfo.goodSort_achieve = 99
            gameInfo.twit_achieve = 99
            
            -- 모든 스킨 해제
            local skins = {}
            for i = 0, 50 do table.insert(skins, tostring(i)) end
            gameInfo.SkinHad = table.concat(skins, ",")
            gameInfo.SkinChoice = "50"
            
            -- 모든 꼬리 해제
            local tails = {}
            for i = 0, 30 do table.insert(tails, tostring(i)) end
            gameInfo.TailHad = table.concat(tails, ",")
            
            -- 수정된 데이터 적용
            json.data.game_info = JSON:stringify(gameInfo)
            response.body = JSON:stringify(json)
        end
    end
    return response
end
