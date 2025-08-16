/*
 * AlphaSquare Premium All-in-One Unlock
 * Developed for LOON
 *
 * 이 스크립트는 AlphaSquare 앱의 JSON 응답 본문을 수정하여
 * 모든 등급 제한을 제거하고 프리미엄 기능을 활성화합니다.
 *
 * [Script Logic]
 * 1. Sresponse.body를 JSON 객체로 파싱합니다.
 * 2. chartgame_review, chart_prediction 등의 특정 기능 플래그를 true로 설정합니다.
 * 3. 등급별 제한이 있는 모든 항목 (예: chartgame_stock_types, indicator_mining_stock_limit)의 값을
 * 'UNLIMITED' 또는 최고 등급(Premium)에 해당하는 값으로 변경합니다.
 * 4. 수정된 JSON 객체를 문자열로 다시 변환합니다.
 * 5. $done() 함수를 사용하여 수정된 응답을 반환합니다.
 */

const body = $response.body;
let obj = JSON.parse(body);

// 1. 최고 등급 회원으로 설정
if (obj.chartgame_review) {
    obj.chartgame_review["alphasquare:premium"] = true;
    obj.chartgame_review["alphasquare:pro"] = true;
    obj.chartgame_review["alphasquare:standard"] = true;
    obj.chartgame_review["alphasquare:basic"] = true;
}

// 2. 모든 기능 제한 해제 (Premium 등급 기준)
const plans = ["alphasquare:basic", "alphasquare:standard", "alphasquare:pro", "alphasquare:premium"];

for (const plan of plans) {
    // 차트게임 기능
    if (obj.chartgame_review) obj.chartgame_review[plan] = true;
    if (obj.chartgame_stock_types) obj.chartgame_stock_types[plan] = "UNLIMITED";
    if (obj.chartgame_freqs) obj.chartgame_freqs[plan] = "UNLIMITED";
    if (obj.chartgame_candle_count) obj.chartgame_candle_count[plan] = 900;
    if (obj.chartgame_free_step) obj.chartgame_free_step[plan] = 100;
    if (obj.chartgame_account_limit) obj.chartgame_account_limit[plan] = 10;
    if (obj.chartgame_pattern_filter) obj.chartgame_pattern_filter[plan] = "UNLIMITED";
    if (obj.chartgame_free_reset_game_limit) obj.chartgame_free_reset_game_limit[plan] = 5;

    // 인디케이터/분석 기능
    if (obj.indicator_mining_stock_types) obj.indicator_mining_stock_types[plan] = "UNLIMITED";
    if (obj.indicator_mining_stock_limit) obj.indicator_mining_stock_limit[plan] = 20;
    if (obj.indicator_mining_signal_types) obj.indicator_mining_signal_types[plan] = ["BUY", "SELL"];
    if (obj.indicator_analysis_config) obj.indicator_analysis_config[plan] = true;
    if (obj.indicator_analysis_stock_type) obj.indicator_analysis_stock_type[plan] = "UNLIMITED";
    if (obj.indicator_analysis_notification_limit) obj.indicator_analysis_notification_limit[plan] = 100;

    // 차트 기능
    if (obj.chart_types) obj.chart_types[plan] = "UNLIMITED";
    if (obj.chart_indicator_limit) obj.chart_indicator_limit[plan] = "UNLIMITED";
    if (obj.chart_compare_limit) obj.chart_compare_limit[plan] = 4;
    if (obj.chart_prediction) obj.chart_prediction[plan] = true;
    if (obj.multi_chart_limit) obj.multi_chart_limit[plan] = "UNLIMITED";

    // 기타 기능
    if (obj.trading_note_count_limit) obj.trading_note_count_limit[plan] = "UNLIMITED";
    if (obj.watchlist_stock_limit) obj.watchlist_stock_limit[plan] = 100;
    if (obj.watchlist_limit) obj.watchlist_limit[plan] = "UNLIMITED";
    if (obj.special_stock_big_factor) obj.special_stock_big_factor[plan] = "UNLIMITED";
    if (obj.financial_limit) obj.financial_limit[plan] = 40;
}

// 수정된 객체를 다시 문자열로 변환하여 반환
const modifiedBody = JSON.stringify(obj);

// LOON에 수정된 본문 전달
$done({ body: modifiedBody });
