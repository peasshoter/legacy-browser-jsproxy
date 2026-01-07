const babel = require("@babel/core");

// 缓存池
const scriptCache = new Map();

module.exports = {
  summary: 'Strict Whitelist Mode',
  
  async beforeSendResponse(requestDetail, responseDetail) {
    const url = requestDetail.url;
    const contentType = responseDetail.response.header['Content-Type'] || '';

    // ============================================================
    // 0. 核心修正：严格的准入检查
    // ============================================================
    // 只有满足以下两个条件之一，才允许进入后续的“读取 Body”环节
    // 否则直接 return null (让 AnyProxy 直接转发流，不要缓存，不要处理)
    //https://h5.sinaimg.cn/m/weibo-pro-next/assets/index-D89y6FrO.js
    const isTargetJs = url.includes('sinaimg.cn') && 
                       url.includes('/weibo-pro-next/assets/') && 
                       url.split('?')[0].endsWith('.js');
                       
    const isHtml = contentType.includes('text/html');

    // 【关键】如果不是目标文件，立刻放行！绝对不要碰 body！
    if (!isTargetJs && !isHtml) {
        return null; 
    }

    // ============================================================
    // 1. 处理 JS (命中白名单)
    // ============================================================
    if (isTargetJs) {
      // 命中缓存直接返回
      if (scriptCache.has(url)) {
          responseDetail.response.body = scriptCache.get(url);
          delete responseDetail.response.header['Content-Length'];
          delete responseDetail.response.header['ETag'];
          return responseDetail;
      }

      try {
        // 只有确信是那个 JS 文件了，才开始读取 Body
        const originalBody = responseDetail.response.body.toString();

        if (!originalBody.includes('?.') && !originalBody.includes('??')) {
           return null;
        }

        console.log(`[Transpiling] ${url.slice(-40)}`);
        
        const result = babel.transformSync(originalBody, {
          filename: url,
          sourceType: "unambiguous", 
          presets: [
            ['@babel/preset-env', { 
              targets: "chrome 68",
              modules: false 
            }]
          ]
        });

        scriptCache.set(url, result.code);
        responseDetail.response.body = result.code;
        
        delete responseDetail.response.header['Content-Length'];
        delete responseDetail.response.header['ETag'];
        delete responseDetail.response.header['Content-Encoding']; 

        return responseDetail;
      } catch (e) {
        console.error(`[Error] Transpile failed:`, e.message);
        return null;
      }
    }

    // ============================================================
    // 2. 处理 HTML (命中白名单)
    // ============================================================
    if (isHtml) {
      try {
        let htmlBody = responseDetail.response.body.toString();
        // 移除 integrity 校验
        const newHtml = htmlBody.replace(/integrity="sha[^"]+"/g, '');
        
        if (htmlBody.length !== newHtml.length) {
            responseDetail.response.body = newHtml;
            delete responseDetail.response.header['Content-Length'];
            delete responseDetail.response.header['ETag'];
            delete responseDetail.response.header['Content-Encoding'];
            return responseDetail;
        }
      } catch (e) {
          return null;
      }
    }

    return null;
  }
};