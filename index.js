
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
var users = [];
var messages = [];
io.on('connection', (socket) => {
  users.push(socket.id)
  io.emit('countUsers',users.length);
  socket.on('ready', function (data) {
      socket.emit('messages',messages);
  });
  socket.on('send', function (data) {
      data.time = new Date().getTime()
      messages.push(data)
      console.log(data)
      io.emit('message',data);
  });
  socket.on('countUsers', function (data) {
      io.emit('countUsers',users.length);
  });
  socket.on('clear', function (data) {
      messages = [];
      io.emit('messages',[]);
  });
  socket.on('disconnect', function () {
      users.splice(users.indexOf(socket.id), 1); 
      io.emit('countUsers',users.length);
      io.emit('console','user disconnected '+socket.id);
  });
})
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function findUser(sid) {
    for (var i = 0; i < users.length; i++) {
        if(users[i]==sid) {
            return users[i];
        }
    }
    return false;
}