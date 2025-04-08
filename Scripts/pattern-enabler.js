// 路径：https://raw.githubusercontent.com/ooops777/test/main/Scripts/pattern-enabler.js

/**
 * AlphaSquare 图表模式强制启用脚本
 * 版本: 1.2.0
 * 作者: YourName
 * 更新日期: 2024-06-01
 */
(function() {
  'use strict'; // 严格模式避免常见错误

  const TAG = '🔵 [AlphaSquare]'; // 日志标识
  let isModified = false; // 标记是否修改过数据

  try {
    // ========================
    // 1. 基础校验
    // ========================
    if (!$response) {
      console.log(`${TAG} 错误: 未捕获到响应对象`);
      return $done({});
    }

    console.log(`${TAG} 拦截到请求 ➔ 状态码: ${$response.status || '未知'}`);

    // ========================
    // 2. 解析响应数据
    // ========================
    const body = JSON.parse($response.body);
    if (!body || typeof body !== 'object') {
      console.log(`${TAG} 错误: 响应数据不是有效的JSON对象`);
      return $done({});
    }

    // ========================
    // 3. 核心修改逻辑
    // ========================
    if (Array.isArray(body.data)) {
      console.log(`${TAG} 发现 ${body.data.length} 个图表模式`);

      body.data.forEach((item, index) => {
        if (item && typeof item.enabled === 'boolean') {
          const original = item.enabled;
          item.enabled = true;
          isModified = true;
          console.log(`${TAG} 修改 #${index} [ID:${item.id}] ${original} → true`);
        }
      });

      if (isModified) {
        console.log(`${TAG} 成功修改 ${body.data.length} 个模式`);
      } else {
        console.log(`${TAG} 未找到可修改的字段`);
      }
    } else {
      console.log(`${TAG} 警告: 响应中缺少 data 数组`);
    }

    // ========================
    // 4. 返回修改结果
    // ========================
    $done({
      body: JSON.stringify(body),
      headers: $response.headers // 保留原始头信息
    });

  } catch (e) {
    console.log(`${TAG} 发生异常: ${e.stack || e.message}`);
    $done({}); // 安全回退
  }
})();
