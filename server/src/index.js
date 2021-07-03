const config = require('./config.js');
const express = require('express');
const http = require('http');
const registerGameHandler = require('./gameHandler.js');
const registerRoomHandler = require('./roomHandler.js');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

const ioServer = new Server(httpServer, {
  cors: {
    origins: config.ALLOWED_FRONTEND_SERVER_URLS,
  }
});

const portToUse = process.env.ENV === "heroku" ? process.env.PORT : config.API_PORT

httpServer.listen(portToUse, () => {
  console.log(`Http server listening on port ${portToUse}`);
});

ioServer.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('missing username'));
  }

  socket.username = username;

  next();
});

ioServer.on('connection', (socket) => {
  console.log(`User ${socket.username} connected.`);
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected.`);
  });

  registerGameHandler(ioServer, socket);
  registerRoomHandler(ioServer, socket);
});
