
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
var cors = require('cors');
app.use(express.static(__dirname + '/', {
    maxage: process.env.NODE_ENV == "production" ? '0d' : '0d'
})) 
app.use(cors({
    origin: '*'
}));
app.get('*', function(req, res) {
   if(req.url) {
     var room = req.url
     console.log(room)
   }
   res.sendfile('index.html');
});
var users = [];
var messages = [];
var logs = [];
io.on('connection', (socket) => {
  users.push(socket.id)
  io.emit('countUsers',users.length);
  socket.on('ready', function (data) {
      var r = socket.handshake.headers.referer
      var room = 'all'
      if(r[r.length-1]!='/') {
        var u = r.split('/')
        room = u[u.length-1]
      }
      socket.join(room);
      socket.emit('messages',roomFilter(messages,room));
  });
  socket.on('send', function (data) {
      data.time = new Date().getTime()
      messages.push(data)
      var r = socket.handshake.headers.referer
      var room = 'all'
      if(r[r.length-1]!='/') {
        var u = r.split('/')
        room = u[u.length-1]
      }
      data.room = room
      io.to(room).emit('message',data);
  });
  socket.on('countUsers', function (data) {
      io.emit('countUsers',users.length);
  });
  socket.on('log', function (data) {
    logs.push(data)
    console.log(data)
  });
  socket.on('getlog', function (data) {
    socket.emit('console',logs)
  });
  socket.on('clear', function (data) {
    var r = socket.handshake.headers.referer
      var room = 'all'
      if(r[r.length-1]!='/') {
        var u = r.split('/')
        room = u[u.length-1]
      }
      var newMessages = []
      for (var i = 0; i < messages.length; i++) {
        if(messages[i].room!=room) {
          newMessages.push(messages[i])
        }
      }
      messages = newMessages;
      io.to(room).emit('messages',[]);
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

function roomFilter(messages,room) {
  var newMessages = [];
  for (var i = 0; i < messages.length; i++) {
    if(messages[i].room==room) {
      newMessages.push(messages[i])
    }
  }
  return newMessages;
}

function findUser(sid) {
    for (var i = 0; i < users.length; i++) {
        if(users[i]==sid) {
            return users[i];
        }
    }
    return false;
}