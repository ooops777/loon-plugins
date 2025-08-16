/*
 * AlphaSquare 프리미엄 올인원 잠금 해제 스크립트 (Loon용)
 *
 * 이 스크립트는 AlphaSquare 앱의 JSON 응답 본문을 수정하여
 * 모든 등급 제한을 제거하고 프리미엄 기능을 활성화합니다.
 *
 * [스크립트 로직]
 * 1. $response.body를 JSON 객체로 파싱합니다.
 * 2. 각 기능 항목을 찾아 프리미엄 등급에 해당하는 값으로 변경합니다.
 * 3. 수정된 JSON 객체를 다시 문자열로 변환합니다.
 * 4. $done() 함수를 사용하여 수정된 응답을 반환합니다.
 *
 * 이 스크립트는 사용자가 제공한 JSON 구조를 기반으로 작성되었습니다.
 */

const body = $response.body;
let obj = JSON.parse(body);

// --- 모든 기능을 프리미엄 등급으로 잠금 해제 ---

// 차트 게임(ChartGame) 기능
obj.chartgame_review = true;
obj.chartgame_stock_types = "UNLIMITED";
obj.chartgame_freqs = "UNLIMITED";
obj.chartgame_candle_count = 900;
obj.chartgame_free_step = 100;
obj.chartgame_account_limit = 10;
obj.chartgame_pattern_filter = "UNLIMITED";
obj.chartgame_free_reset_game_limit = 5;
obj.chartgame_indicator_roles = ["basic", "premium"];
obj.chartgame_strategy_roles = ["basic", "premium"];

// 트레이딩 및 분석 기능
obj.trading_note_count_limit = "UNLIMITED";
obj.indicator_mining_strategy_roles = ["basic", "premium"];
obj.indicator_mining_stock_types = "UNLIMITED";
obj.indicator_mining_stock_limit = 20;
obj.indicator_mining_signal_types = ["BUY", "SELL"];
obj.indicator_analysis_config = true;
obj.indicator_analysis_strategy_roles = ["basic", "premium"];
obj.indicator_analysis_stock_type = "UNLIMITED";
obj.indicator_analysis_notification_limit = 100;

// 차트 기능
obj.chart_types = "UNLIMITED";
obj.chart_indicator_limit = "UNLIMITED";
obj.chart_compare_limit = 4;
obj.chart_prediction = true;
obj.multi_chart_limit = "UNLIMITED";
obj.chart_strategy_roles = ["basic", "premium"];

// 관심종목 및 기타 기능
obj.watchlist_stock_limit = 100;
obj.watchlist_limit = "UNLIMITED";
obj.special_stock_big_factor = "UNLIMITED";
obj.financial_limit = 40;

// --- 스크립트 종료 ---

// 수정된 JSON 객체를 다시 문자열로 변환합니다.
const modifiedBody = JSON.stringify(obj);

// Loon에 수정된 응답 본문을 전달합니다.
$done({ body: modifiedBody });
