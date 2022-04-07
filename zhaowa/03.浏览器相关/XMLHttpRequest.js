
// 实例化
const xhr = new XMLHttpRequest()
// 初始化连接(get/post, url, 是否异步请求)
xhr.open(method, url, async)
// 发送请求
xhr.send(data)
// 接收返回
xhr.onreadystatechange = () => {
  // 4 请求已完成
  if (xhr.readyState === 4) {
    // http状态码
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      console.log(xhr.responseText)
    }
  }
}
// 设置超时时间
xhr.timeout = 3000

xhr.ontimeout = () => {
  // 超时后执行的代码
}