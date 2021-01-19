const net = require('net');

class Request{
  // method,url = host + port + path
  // body: k/v
  // headers
  constructor(options){
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
    if(!this.headers["Content-Type"]){
      this.headers['Content-Type'] = "application/x-www-form-urlencoded"
    }
    if(this.headers['Content-Type'] == "application/json"){
      this.bodyText = JSON.stringify(this.body)
    }else if(this.headers['Content-Type'] == "application/x-www-form-urlencoded"){
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    this.headers["Content-Length"] = this.bodyText.length
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) =>{
      const parser = new ResponseParser()
      if(connection){
        connection.write(this.toString())
      } else {
        connection = net.createConnection({ 
          host: this.host,
          port: this.port }, () => {
            // console.log(this.toString())
            connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        // console.log(data.toString())
        parser.receive(data.toString())
        if(parser.isFinished){
          resolve(parser.response)
        }
        // 这里是流式数据 无法知道是否完整
        // resolve(data.toString());
        // connection.end();
      });
      connection.on('end', () => {
        console.log('disconnected from server');
      });
      connection.on('error', err=>{
        reject(err)
        connection.end()
      })

    })
  }
}

class Response{

}

// 流式数据 粘包问题
// 流式数据 一部分一部分 灌入ResponseParser
// 当收集满足一个响应 则会吐出一个 Response
class ResponseParser{
  // 状态机
  constructor(){
    this.WAITTING_STATUS_LINE = 0 // status line
    this.WAITTING_STATUS_LINE_END = 1 // \r\n
    this.WAITTING_HEADER_NAME = 2  // header key
    this.WAITTING_HEADER_SPACE = 3  // header space   key: value
    this.WAITTING_HEADER_VALUE = 4  // header value
    this.WAITTING_HEADER_LINE_END = 5 // \r\n
    this.WAITTING_HEADER_BLOCK_END = 6  // 空行 \r\n
    this.WAITTING_BODY = 7  //  body
    
    this.current = this.WAITTING_STATUS_LINE // 当前状态
    this.statusLine = ""
    this.headers = {}
    this.headerName = ""
    this.headerValue = ""
    this.bodyParser = null

  }

  receive(string){
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body:this.bodyParser.content.join('')
    }
  }

  receiveChar(char){
    if(this.current === this.WAITTING_STATUS_LINE){
      if(char === '\r'){
        this.current = this.WAITTING_STATUS_LINE_END
      }else{
        this.statusLine += char
      }
    }else if(this.current === this.WAITTING_STATUS_LINE_END){
      if(char === '\n'){
        this.current = this.WAITTING_HEADER_NAME
      }
    }else if(this.current === this.WAITTING_HEADER_NAME){
      if(char === '\r'){
        this.current = this.WAITTING_HEADER_BLOCK_END
      }else if(char === ':'){
        this.current = this.WAITTING_HEADER_SPACE
      }else{
        this.headerName += char
      }
    }else if(this.current === this.WAITTING_HEADER_SPACE){
      if(char === ' '){
        this.current = this.WAITTING_HEADER_VALUE
      }
    }else if(this.current === this.WAITTING_HEADER_VALUE){
      if(char === '\r'){
        this.current = this.WAITTING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ""
        this.headerValue = ""
      }else{
        this.headerValue += char
      }
    }else if(this.current === this.WAITTING_HEADER_LINE_END){
      if(char === '\n'){
        this.current = this.WAITTING_HEADER_NAME
      }
    }else if(this.current === this.WAITTING_HEADER_BLOCK_END){
      if(char === '\n'){
        this.current = this.WAITTING_BODY
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunkedBodyParser()
        }
      }
    }else if(this.current === this.WAITTING_BODY){
      this.bodyParser.receiveChar(char)
    }
    
  }
}
class TrunkedBodyParser{
  constructor(){
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4

    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }

  receiveChar(char){
    // console.log(JSON.stringify(char)) // 这里可以查看接收到的样式
    if(this.current === this.WAITING_LENGTH){
      if(char === '\r'){
        if(this.length === 0){
          this.isFinished = true
          return
        }
        this.current = this.WAITING_LENGTH_LINE_END
      }else{
        this.length *= 10 //10进制的末尾加一位 所以乘10
        this.length += Number(char)//char.charCodeAt(0) - '0'.charCodeAt(0)

        // this.length *=16
        // this.length += parseInt(char, 16)
      }
    }else if(this.current === this.WAITING_LENGTH_LINE_END){
      if(char === '\n'){
        this.current = this.READING_TRUNK
      }
    }else if(this.current === this.READING_TRUNK){
      this.content.push(char)
      this.length--
      if(this.length === 0){
        this.current = this.WAITING_NEW_LINE
      }
    }else if(this.current === this.WAITING_NEW_LINE){
      if(char === '\r'){
        this.current = this.WAITING_NEW_LINE_END
      }
    }else if(this.current === this.WAITING_NEW_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_LENGTH
      }
    }
  }
}

// 这里是request header*****************
// POST / HTTP/1.1    // request line
// Host: 127.0.0.1 
// Content-Type: application/x-www-form-urlencoded 
// Content-Length: 11  // 以上是 headers
                // 这里要有空行
// name=junhao // 属于 body

// 这里是 response ***************************************
// HTTP/1.1 200 OK  // status line  协议 状态码 状态
// Content-Type: text/plain
// X-Foo: bar
// Date: Sat, 16 May 2020 11:27:54 GMT
// Connection: keep-alive
// Transfer-Encoding: chunked   // 以上是header   //Transfer-Encoding 传输编码 Node 一般是chunked
              // 这里是空行  下边是body  每个chunked都包含以下几项
// 2  //单独一行 表示后边有多少个字符
// ok // 传输内容（字符）
// ..... 一直到 0 结束
// 0
//    空行


void async function(){
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]:"customed"
    },
    body: {
      name: "junhao"
    }
  })
  
  let response = await request.send()
  console.log(response)

  // console.log('abv\rsdf')
}();




// Part One
// const client = net.createConnection({ 
//   host:"127.0.0.1",
//   port: 8088 }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');
//   // 文本协议  分隔符 \r\n
//   // client.write('POST / HTTP/1.1\r\n');
//   // client.write('Host: 127.0.0.1\r\n');
//   // client.write('Content-Length: 20\r\n')
//   // // application/x-www-form-urlencoded 表单提交
//   // client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//   // client.write('\r\n');
//   // client.write('feild=aaa&code=x%3D1\r\n');

//   let request = new Request({
//     method: "POST",
//     host: "127.0.0.1",
//     port: "8088",
//     path: "/",
//     // headers: {
//     //   ["X-Foo2"]:"customed"
//     // },
//     body: {
//       name: "junhao"
//     }
//   })

//   console.log(request.toString())
//   client.write(request.toString())
// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });
// client.on('error', err=>{
//   console.log(err)
//   client.end()
// })