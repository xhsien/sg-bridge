const crypto = require('crypto');

const roomToPlayers = new Map();

module.exports = (io, socket) => {
  getNewRoom = () => {
    let newRoomNumber = null;
    while (!newRoomNumber || roomToPlayers.has(newRoomNumber)) {
      newRoomNumber = crypto.randomBytes(2).toString('hex').toUpperCase();
    }

    return newRoomNumber;
  };

  socket.on('new room', (callback) => {
    const newRoomNumber = getNewRoom();

    roomToPlayers.set(newRoomNumber, [{username: socket.username, isHost: true}]);
    socket.join(newRoomNumber);

    callback({
      roomNumber: newRoomNumber,
      players: roomToPlayers.get(newRoomNumber),
    });
  });

  socket.on('join room', (roomNumber, callback) => {
    if (!roomToPlayers.has(roomNumber)) {
      callback();
      return;
    }

    roomToPlayers.get(roomNumber).push({username: socket.username, isHost: false});
    socket.join(roomNumber);

    callback({
      players: roomToPlayers.get(roomNumber),
    });

    io.to(roomNumber).emit('room update', roomToPlayers.get(roomNumber));
  });
};
