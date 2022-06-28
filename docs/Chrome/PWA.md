# PWA 渐进式网页应用
> Progressive Web App \
> 通过技术手段渐进式缩短和本地应用或者小程序的距离

## web应用 vs 本地应用

- 缺少离线使用能力
- 缺少消息推送
- 缺少一级入口
  - 引入 manifest.json 来解决

## 解决方案 Service Worker
> 解决离线存储和消息推送

- 在页面和网络之间 增加一个拦截器，用来缓存和拦截请求。
  - webApp 在请求资源时 先通过 Service Worker, 让它判断是返回缓存还是重新请求。

### 设计思路

- 架构
  - “让其运行在主线程之外” 来自Web Worker的核心思想
    - 没有dom环境
    - 通过postMessage 发送结果给主线程
  - 目前Chrome架构中，Service Worker 运行在浏览器进程中，能够为所有页面提供服务
  - 采用 HTTPS
