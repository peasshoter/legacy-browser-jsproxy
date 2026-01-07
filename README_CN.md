# 🕸️ Legacy Browser Proxy (老旧浏览器兼容代理)

> 专为 "钉子户" 浏览器（如 Chrome 68）打造的中间人代理工具，解决因不支持 ES2020+ 新语法（可选链 `?.`、空值合并 `??`）导致的网页白屏问题。

## 📖 项目背景

随着前端技术的发展，现代网页大量使用了 **Optional Chaining (`?.`)** 和 **Nullish Coalescing (`??`)** 等新语法。然而，Chrome 80（2020年发布）以下的老旧版本浏览器无法解析这些语法，会在控制台报错 `SyntaxError` 并导致页面渲染中断。

在某些受限环境（如公司内网、旧设备）无法升级浏览器的情况下，本项目提供了一种**无需触碰浏览器内核**的“外挂”解决方案。

## ⚡ 核心功能

* **💉 实时外科手术**：拦截 HTTP/HTTPS 响应，使用 **Babel** 实时将不兼容的 JS 代码转译为 ES5。
* **🛡️ SRI 自动绕过**：自动移除 HTML 中的 `integrity` 属性，防止因修改代码导致的子资源完整性校验失败。
* **🚀 智能缓存机制**：内置内存缓存池，转译过的文件直接复用，避免重复计算，速度飞快。
* **🎯 严格白名单模式**：默认仅拦截和处理特定的 JS/HTML 资源，图片、视频、API 接口等流量直接透传（Pass-through），确保浏览体验不卡顿。

## 🛠️ 快速开始

### 1. 环境准备
确保你的电脑已安装 [Node.js](https://nodejs.org/) (建议 v14+)。

### 2. 安装依赖
```bash
git clone [https://github.com/你的用户名/legacy-browser-jsproxy.git](https://github.com/你的用户名/legacy-browser-jsproxy.git)
cd legacy-browser-jsproxy
npm install
3. 生成并信任证书 (HTTPS 必须)
本项目基于 AnyProxy，需要解密 HTTPS 流量才能修改代码。

Bash

npx anyproxy-ca
执行后会生成根证书（通常位于 ~/.anyproxy/certificates/）。

关键步骤：请双击打开生成的 rootCA.crt，将其安装并设置为 “始终信任”（Windows 下需放入“受信任的根证书颁发机构”）。

4. 启动代理
Bash

npx anyproxy --rule ./proxy_rule.js --intercept
看到 Http proxy started at 8001 即表示启动成功。

5. 浏览器设置
打开你的 Chrome 68（或其他旧浏览器），配置代理服务器：

协议：HTTP 和 HTTPS

地址：127.0.0.1

端口：8001

现在，刷新那些曾经打不开的页面吧！🎉
⚙️ 配置与自定义
本项目默认配置了针对 新浪/微博 的白名单规则。如果你想支持其他网站，请打开 proxy_rule.js 修改以下逻辑：

JavaScript

// 修改此处以匹配你需要修复的网站资源特征
const isTargetJs = url.includes('你的目标域名.com') && 
                   url.includes('/assets/') && // 尽量缩小范围以提升性能
                   url.split('?')[0].endsWith('.js');
🧩 原理图解
代码段

sequenceDiagram
    participant B as Chrome 68
    participant P as Proxy (本项目)
    participant S as 目标服务器

    B->>P: 请求 index.js (含 ES2020 语法)
    P->>S: 转发请求
    S-->>P: 返回原始代码
    P->>P: 命中白名单？
    alt 是
        P->>P: Babel 转译 (ES2020 -> ES5)
        P->>P: 存入缓存
    else 否
        P->>P: 直接透传
    end
    P-->>B: 返回兼容的代码
    B->>B: 正常执行，页面渲染成功
⚠️ 免责声明
本项目仅供技术研究、学习及调试使用。

项目涉及 HTTPS 流量解密，请勿在不安全的网络环境中使用。

请勿用于任何非法用途。
