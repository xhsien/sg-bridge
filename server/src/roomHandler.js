const crypto = require('crypto');

const errors = require('./error');

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

    roomToPlayers.set(newRoomNumber, [{id: socket.id, username: socket.username, isHost: true}]);
    socket.join(newRoomNumber);

    callback({
      roomNumber: newRoomNumber,
      players: roomToPlayers.get(newRoomNumber),
    });
  });

  /* response format: {
    "error": // null if no error; error msg if there is err
    "data": // list of players if there is no err; null if there is err
  }*/
  socket.on('join room', (roomNumber, callback) => {
    if (!roomToPlayers.has(roomNumber)) {
      callback({
        error: errors.ROOM_NOT_EXIST
      });
      return;
    } else if (roomToPlayers.get(roomNumber).length >= 4) {
      callback({
        error: errors.ROOM_FULL
      });
      return;
    }

    roomToPlayers.get(roomNumber).push({id: socket.id, username: socket.username, isHost: false});
    socket.join(roomNumber);

    callback({
      data: {
        players: roomToPlayers.get(roomNumber),
      }
    });

    io.to(roomNumber).emit('room update', roomToPlayers.get(roomNumber));
  });
};
