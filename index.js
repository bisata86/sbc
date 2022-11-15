// ** LOAD NODE MODULES **
var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/', {
    maxage: process.env.NODE_ENV == "production" ? '0d' : '0d'
})) 

var port = process.env.PORT || 3000;
app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.listen(port, function() {
    console.log('sbc up on port: ' + port)
});
//io.set('origins', '*:*');
io.on('connection', function(socket) {
   console.log('A user connected');
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});
