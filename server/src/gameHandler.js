module.exports = (io, socket) => {
  socket.on('start game', (roomNumber) => {
    io.to(roomNumber).emit('game started');
  });
};
