// socketio server instance
let io;

// assign the user to a room
const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    socket.join('room1');
    socket.name = data.user;
    console.log(`User ${data.user} just joined the room`);
  });
};

// set up the socket events
const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    onJoined(socket);
  });
};

module.exports = {
  setupSockets,
};
