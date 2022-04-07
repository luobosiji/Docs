# 性能优化

## 网络优化
- https 多次连接，导致网络请求加载时间延长，增加开销
  - http - 应用层  < = > TCP - 传输层 （经过TCP三次握手 进行连接）
  - 优化：合并请求，长连接
    - 2.0多条并发请求复用同一条通路 - 复用通路，无并发限制
  - 中间层，整合请求 异常处理
- 域名解析
  - 浏览器DNS缓存
  - 系统缓存  host文件
  - 路由器缓存
  - 服务器站点缓存
    - CDN Content Delivery Network
      - 为同一个主机配置多个ip地址
      - LB 负载均衡

## 手写并发 QPS
  - 后台只能并发处理三个，如何优化
  - 通过 promise、limit、reqpool请求池
    - 根据limit 来向reqpool中添加请求并发起请求
    - 使用 Promise.race() 来执行 ，有返回后继续向reqpool中添加
```javascript
  // 面试：并发优化 10个请求，由于后台或者业务需求只能同时执行三个
  // 分析：
  // 输入：promise数组、limit参数
  // 存储：reqpool - 并发池
  // 思路：塞入 + 执行
  function qpsLimit(requestPipe, limitMax = 3) {
      let reqPool = []
      let reqMap = new Map()

      // 往并发池里塞入promise
      const add = () => {
          let _req = requestPipe.shift()

          reqPool.push(_req)
      }
  
      // 执行实际请求
      const run = () => {
          if(requestPipe.length === 0) return
          // 池子满了发车后，直接race
          let _finish = Promise.race(reqPool)

          _finish.then(res => {
              // 做一个id整理
              let _done = reqPool.indexOf(_finish)
              reqPool.splice(_done, 1)
              add()
          })
          run()
      }

      while(reqPool.length < limitMax) {
          add()
      }
      run()
  }
```


## 减少重排
- 浏览器执行顺序
  - HTML => DOM + CSSOM => renderTree + js => layout => paint
- repaint 重绘 改变文本、颜色等
  - visibility:hidden
- reflow 改变位置、尺寸等
  - display: none 

## 脚本执行时
- 内存泄漏
  - 释放变量
  - 清理定时器
  - 清理闭包

## 打包配置优化
- 懒加载
- 按需引入
- 抽离公共模块