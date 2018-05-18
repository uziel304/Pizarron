
var express = require('express');
var app = express();
var server = app.listen(5000);

app.use(express.static('public'));

console.log("Estado:Conectado")

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection',function nuevaConeccion(socket) {
  console.log("nueva coneccion: "+socket.id);

  socket.on('mouse',function mouseMensaje(dato) {

    socket.broadcast.emit('mouse',dato);
    console.log(dato);

  });
});