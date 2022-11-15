
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/', {
    maxage: process.env.NODE_ENV == "production" ? '0d' : '0d'
})) 
app.get('/', function(req, res) {
   res.sendfile('index.html');
});
io.on('connection', (socket) => {
  console.log('user connected');
  io.emit('console','user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
      io.emit('console','user disconnected');


  });
})
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});