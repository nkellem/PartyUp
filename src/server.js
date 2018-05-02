// Pull in dependencies
const path = require('path');
const express = require('express');
const http = require('http');
const compression = require('compression');
const favicon = require('serve-favicon');
const expressHandlebars = require('express-handlebars');
const router = require('./router.js');
const socketio = require('socket.io');
const sockets = require('./sockets.js');

// add port for the app to listen on
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
const server = http.Server(app);
app.use('/assets', express.static(path.resolve(`${__dirname}/../client`)));
app.use(favicon(`${__dirname}/../client/images/favicon.ico`));
app.disable('x-powered-by');
app.use(compression());
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

// pass express server into socketio and grab the websocket server
const io = socketio(server);

// hook up our socket events on the Server
sockets.setupSockets(io);

// start the sever
server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${PORT}`);
});
