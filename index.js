const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html', users);
});

// io.on('connection', (socket) => {
//   socket.broadcast.emit('User Connected');
// });

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('chat message', (msg) => {
    console.log(users)
    io.emit('chat message', { msg: msg, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];

  });

});





httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});