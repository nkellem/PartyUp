// socketio server instance
let io;

// lets the host know that it is the host
const confirmHost = (sock) => {
  const socket = sock;

  socket.isHost = true;
  socket.hostSocket = socket;

  socket.emit('hostConfirmation', { hostName: socket.name });

  // handle host events
  console.log(`The host is user ${socket.name}`);
};

// Set up socketio events
const designateHost = (sock) => {
  const socket = sock;

  const socketRoom = io.sockets.adapter.rooms[socket.belongsTo];

  if (!socketRoom || socketRoom.length === 0) {
    confirmHost(socket);
  } else {
    socket.isHost = false;
    const socketKeys = Object.keys(socketRoom.sockets);

    let hostFound = false;

    for (let i = 0; i < socketKeys.length; i++) {
      // grab the socket object from the overall socket list
      // based on the socket ids in the room
      const socketUser = io.sockets.connected[socketKeys[i]];
      console.log(socketUser.name);

      // if this socket is the host and matches our room name
      if (socketUser.isHost) {
        // set the host socket reference as this socket's hostSocket (custom property)
        socket.hostSocket = socketUser;
        socket.emit('hostAcknowledge', { hostName: socket.hostSocket.name });
        console.log(`Host for ${socket.belongsTo} is ${socket.hostSocket.name}`);
        hostFound = true; // flag we did find a host (in case host left)
        break; // stop searching for a host
      }
    }

    if (!hostFound) {
      confirmHost(socket);
    }
  }
};

// assign the user to a room
const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    socket.join(data.room);
    socket.name = data.user;
    socket.belongsTo = data.room;
    console.log(`User ${data.user} just joined the ${data.room}`);
    designateHost(socket);
  });
};

// handle incoming queue requests from clients
const onClientSendVideoId = (sock) => {
  const socket = sock;

  socket.on('clientSendVideoId', (data) => {
    console.log('client sent video id');
    socket.hostSocket.emit('clientSentVideoId', data);
  });
};

// set up the socket events
const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    onJoined(socket);
    onClientSendVideoId(socket);
  });
};

module.exports = {
  setupSockets,
};
