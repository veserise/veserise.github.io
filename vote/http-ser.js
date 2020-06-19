const http = require('http')
const net = require('net')
const url = require('url')
const fs = require('fs')
const port = 8080

const server = http.createServer()

server.on('request', (req, res) => {
  var u = url.parse(req.url);

  var options = {
      hostname : u.hostname, 
      port     : u.port || 80,
      path     : u.path,       
      method     : req.method,
      headers     : req.headers
  };

  var pReq = http.request(options, function(pRes) {
      res.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(res);
  }).on('error', function(e) {
      res.end();
  });
  req.pipe(pReq);
})

server.on('connect', (req, WebSocket, head) =>{
  console.log(req.method, req.url)

  var [host, por] = req.url.split(':')
  var target = net.connect(por, host, (req,res)=>{
    WebSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
    target.pipe(WebSocket).pipe(target)
  })

  target.on('error', ()=>{ })
  WebSocket.on('error', ()=>{})
})


server.listen(port, ()=>{
  console.log('listen to connect:  ' + port)
})
