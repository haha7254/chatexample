var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


//var test = io.of('');
var room = 'room';
var port = process.env.PORT ||3000;


io.on('connection', function(socket){

  //add user
  socket.on('register', function(id){
    console.log(id+' is connected to server.');

    io.to(room).emit('chat message', { 'username' : id, 'msg': 'is joing the party. '});
    //socket.broadcast.emit('chat message', id+ ' is coming!'); //for not self

    socket.username = id;

    //add channel
    // if(socket.username == 'test' || socket.username == 'test123'){
    //   room = 'room2';
    // }
    // else {
    //     room = 'room1';
    // }
    socket.join(room);
    console.log('you ar joining in '+room);


  });



  //receive event
  socket.on('chat message', function(msg){

    io.to(room).emit('chat message',{ 'username' : socket.username, 'msg': msg});
  });


  socket.on('disconnect', function(soceket){
    console.log(socket.username + ' bye!' );
    io.to(room).emit('user left', {'username': socket.username});

  });


});



http.listen(port, function(){
  console.log('listening on *:3000');
});
