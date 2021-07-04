const crypto = require('crypto');
const errors = require('./error');
const db = require("./db");

module.exports = (io, socket) => {
  getNewRoom = async () => {
    let newRoomNumber = null;
    while (!newRoomNumber || await (db.roomExists(newRoomNumber))) {
      newRoomNumber = crypto.randomBytes(2).toString('hex').toUpperCase();
    }

    return newRoomNumber;
  };

  socket.on('new room', async (callback) => {
    const newRoomNumber = await getNewRoom();

    const players = [{id: socket.id, username: socket.username, isHost: true}];

    db.setPlayersForRoom(newRoomNumber, players);
    socket.join(newRoomNumber);

    callback({
      roomNumber: newRoomNumber,
      players: players,
    });
  });

  /* response format: {
    "error": // null if no error; error msg if there is err
    "data": // list of players if there is no err; null if there is err
  }*/
  socket.on('join room', async (roomNumber, callback) => {
    if (!await (db.roomExists(roomNumber))) {
      callback({
        error: errors.ROOM_NOT_EXIST
      });
      return;
    } 

    const players = await db.getPlayersForRoom(roomNumber);
    
    if (players.length >= 4) {
      callback({
        error: errors.ROOM_FULL
      });
      return;
    }

    players.push({id: socket.id, username: socket.username, isHost: false});
    db.setPlayersForRoom(roomNumber, players);
    socket.join(roomNumber);

    callback({
      data: {
        players: players,
      }
    });

    io.to(roomNumber).emit('room update', players);
  });
};
