const game = new Map();

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

class Game {
  constructor(playerIds, playerUsernames) {
    this.roundNumber = 0;
    this.nextPlayer = null;
    this.currentRound = []; // [{firstPlayer, card}, {secondPlayer, card}, {thirdPlayer, card}, {forthPlayer, card}]
    this.playerRemainingCards = [];
    this.playerWinCounts = [];

    this.trump = null;
    this.history = [];

    // metadata
    this.playerIds = playerIds;
    this.playerUsernames = playerUsernames;
  }

  init() {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['S', 'H', 'D', 'C'];

    const cards = [];
    for (let rank of ranks) {
      for (let suit of suits) {
        cards.push(suit + rank);
      }
    }

    const shuffledCards = shuffle(cards);
    this.playerRemainingCards.push(shuffledCards.slice(0, 13));
    this.playerRemainingCards.push(shuffledCards.slice(13, 26));
    this.playerRemainingCards.push(shuffledCards.slice(26, 39));
    this.playerRemainingCards.push(shuffledCards.slice(39, 52));
  }

  setTrumpAndFirstPlayer(trump, firstPlayerId) {
    this.trump = trump;
    this.nextPlayer = playerIds.indexOf(firstPlayerId);
  }

  getState() {
    return {
      roundNumber: this.roundNumber,
      nextPlayer: this.nextPlayer,
      currentRound: this.currentRound,
      playerRemainingCards: this.playerRemainingCards,
      playerWinCounts: this.playerWinCounts,

      playerIds: this.playerIds,
      playerUsernames: this.playerUsernames,
    }
  }
};

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

    game[roomNumber] = new Game(playerIds, playerUsernames);
    game[roomNumber].init();

    io.to(roomNumber).emit('game started', game[roomNumber].getState());
  });

  socket.on('setup game', (roomNumber, trump, firstPlayerId) => {
    game[roomNumber].setTrumpAndFirstPlayer(trump, firstPlayerId);

    io.to(roomNumber).emit('game set', game[roomNumber].getState(), trump, firstPlayerId);
  });
};
