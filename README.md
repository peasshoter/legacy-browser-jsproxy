> [🇨🇳 中文文档请点击这里](./README_CN.md)
# Chrome 68 Resurrection Proxy 🚀

A specialized HTTP proxy tool designed to make modern, heavy web applications (like Weibo) workable on legacy browsers (specifically Chrome 68).

## 🧐 The Problem

Modern websites heavily rely on ES2020+ features like **Optional Chaining (`?.`)** and **Nullish Coalescing (`??`)**. 
Legacy browsers (e.g., Chrome 68, released in 2018) throw `SyntaxError` when parsing these tokens, causing white screens or broken functionality.

Updating the browser isn't always an option in certain restricted environments.

## 💡 The Solution

This project uses **AnyProxy** to intercept HTTP responses and **Babel** to transpile JavaScript code in real-time before it reaches the browser.

It features:
* **Targeted Interception**: Only transpiles specific JS files (whitelist mode) to ensure performance.
* **SRI Stripping**: Automatically removes Subresource Integrity checks from HTML to allow modified JS execution.
* **Memory Caching**: Caches transpiled code to prevent CPU bottlenecks on subsequent requests.
* **Strict Whitelisting**: Passes through binary streams (images, logs) without buffering to prevent hanging.

## 🛠 Prerequisites

* Node.js (v14+)
* Google Chrome 68 (or any browser older than Chrome 80)

## 📦 Installation

1.  Clone the repo:
    ```bash
    git clone [https://github.com/your-username/chrome68-resurrection.git](https://github.com/your-username/chrome68-resurrection.git)
    cd chrome68-resurrection
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Generate CA certificate for HTTPS interception:
    ```bash
    npx anyproxy-ca
    ```
    *Trust the generated root CA in your OS/Browser certificate store.*

## 🚀 Usage

1.  Start the proxy server:
    ```bash
    npx anyproxy --rule ./proxy_rule.js --intercept
    ```

2.  Configure your browser proxy:
    * **IP**: 127.0.0.1
    * **Port**: 8001 (HTTP & HTTPS)

3.  Surf the web like it's 2026!

## ⚠️ Disclaimer

This tool is for educational and debugging purposes only. It performs "Man-in-the-Middle" decryption of HTTPS traffic locally. Do not use this in untrusted networks.
