const http = require('http')

// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  console.log('request')
  console.log(req.headers)
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ookk');
});

server.listen(8088)

// var xhr = new XMLHttpRequest;
// xhr.open("get", "http://127.0.0.1:8088", true)
// xhr.send(null)

// xhr.responseText --> ookk
// xhr.HEADERS_RECEIVEO
