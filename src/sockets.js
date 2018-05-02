// socketio server instance
let io;

// lets the host know that it is the host
const confirmHost = (sock) => {
  const socket = sock;

  socket.isHost = true;
  socket.hostSocket = socket;

  socket.emit('hostConfirmation');
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

      // if this socket is the host and matches our room name
      if (socketUser.isHost) {
        // set the host socket reference as this socket's hostSocket (custom property)
        socket.hostSocket = socketUser;
        socket.emit('hostAcknowledge');
        hostFound = true; // flag we did find a host (in case host left)
        socket.hostSocket.emit('userJoined', { socketId: socket.id });
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
    socket.belongsTo = data.room;
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

// handle incoming queue data from the host and route it to clients
const onSendQueueToClients = (sock) => {
  const socket = sock;

  socket.on('sendQueueToClients', (data) => {
    console.log('queue received and sent');
    socket.hostSocket.broadcast.emit('hostSentQueue', data);
  });
};

// handle incoming next requests from the client
const onClientHitNext = (sock) => {
  const socket = sock;

  socket.on('clientHitNext', () => {
    socket.hostSocket.emit('clientHitNext');
  });
};

// handle incoming restart requests from the client
const onClientHitRestart = (sock) => {
  const socket = sock;

  socket.on('clientHitRestart', () => {
    console.log('client hit restart');
    socket.hostSocket.emit('clientHitRestart');
  });
};

// handle incoming host request to update the client
const onSendCurrentlyPlaying = (sock) => {
  const socket = sock;

  socket.on('sendCurrentlyPlaying', (data) => {
    console.log('currently playing updated');
    socket.hostSocket.broadcast.emit('sendCurrentlyPlaying', data);
  });
};

// handle incoming host request to send the client the current queue
const onSendUserQueue = (sock) => {
  const socket = sock;

  socket.on('sendUserQueue', (data) => {
    console.log('send user queue');
    const dataToSend = {
      queue: data.queue,
      joined: true,
      title: data.title,
      currPlayImg: data.currPlayImg,
    };
    socket.hostSocket.to(data.socketId).emit('hostSentQueue', dataToSend);
  });
};

// set up the socket events
const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    onJoined(socket);
    onClientSendVideoId(socket);
    onSendQueueToClients(socket);
    onClientHitNext(socket);
    onClientHitRestart(socket);
    onSendCurrentlyPlaying(socket);
    onSendUserQueue(socket);
  });
};

module.exports = {
  setupSockets,
};
