const db = require("./db");
const Game = require("./models/game")

module.exports = (io, socket) => {
  socket.on('start game', (roomNumber, callback) => {
    console.log(callback);
    console.log(io.to(roomNumber).adapter.rooms.get(roomNumber));
    const playerIds = Array.from(io.to(roomNumber).adapter.rooms.get(roomNumber));
    const playerUsernames = playerIds.map((playerId) => io.sockets.sockets.get(playerId).username);
    console.log(playerUsernames);

    if (playerIds.length != 4) {
      callback({error: 'Must have 4 players in room.'});
      return;
    }

    const game = new Game(playerIds, playerUsernames);
    game.init();

    io.to(roomNumber).emit('game started', game.getState());

    db.setGameForRoom(roomNumber, game);

  });

  socket.on('setup game', async (roomNumber, trump, firstPlayerId) => {
    console.log(`Received setup game event for ${roomNumber}, trump is ${trump} and firstPlayerId is ${firstPlayerId}`);

    const game = await db.getGameForRoom(roomNumber);

    game.setTrumpAndFirstPlayer(trump, firstPlayerId);

    io.to(roomNumber).emit('game set', game.getState());
    db.setGameForRoom(roomNumber, game);
  });

  socket.on('play card', async (roomNumber, playerId, card) => {
    console.log(`player ${playerId} played card ${card}.`);
    const game = await db.getGameForRoom(roomNumber);

    const result = game.playCard(playerId, card);
    if (!result) {
      return;
    }

    const state = game.getState();
    console.log(state);

    io.to(roomNumber).emit('card played', state);
    db.setGameForRoom(roomNumber, game);
  })
};
