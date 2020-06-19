const http = require('http')
const path = require('path')
const url = require('url')
const server = http.createServer(app)
const socketIo = require('socket.io')
const ioServer = socketIo(server)

ioServer.on('connection', socket => {
  var path = url.parse(socket.request.headers.referer).path
  socket.on('select room', roomid => {
    socket.join('/vote/' + roomid)
  })
})