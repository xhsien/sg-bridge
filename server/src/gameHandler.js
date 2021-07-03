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

class Card {
  /**
   * 
   * @param {string} suit Suit of the card, one of 'C', 'D', 'H', 'S'
   * @param {string} rank Rank of the card, one of '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
   */
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  constructor(cardString) {
    this.suit = cardString[0];
    this.rank = cardString[1];
  }

  getSuit() {
    return this.suit;
  }

  getRank() {
    return this.rank;
  }

  get() {
    return this.suit + this.rank;
  }

  static suits = 'CDHS';
  static ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  static compareRank(card1, card2) {
    const rankOrder1 = Card.ranks.indexOf(card1.getRank());
    const rankOrder2 = Card.ranks.indexOf(card2.getRank());
    if (rankOrder1 < rankOrder2) {
      return -1;
    } else if (rankOrder1 > rankOrder2) {
      return 1;
    }

    return 0;    
  }

  /**
   * Sort by suit 'C' -> 'D' -> 'H' -> 'S'
   * then by rank '2' ->'3' ->'4' ->'5' ->'6' ->'7' ->'8' ->'9' ->'10' ->'J' ->'Q' ->'K' ->'A'
   * 
   * @param {!Card} card1 First card.
   * @param {!Card} card2 Second card.
   */
  static compare(card1, card2) {
    const suitOrder1 = Card.suits.indexOf(card1.getSuit());
    const suitOrder2 = Card.suits.indexOf(card2.getSuit());
    if (suitOrder1 < suitOrder2) {
      return -1;
    } else if (suitOrder1 > suitOrder2) {
      return 1;
    }

    return Card.compareRank(card1, card2);
  }
}

class Game {
  constructor(playerIds, playerUsernames) {
    this.roundNumber = 0;
    this.nextPlayer = null;
    this.currentRound = []; // [{firstPlayer, card}, {secondPlayer, card}, {thirdPlayer, card}, {forthPlayer, card}]
    this.playerRemainingCards = [];
    this.playerWinCounts = [0, 0, 0, 0];

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
    for (let suit of suits) {
      for (let rank of ranks) {
        cards.push(new Card(suit, rank));
      }
    }

    const shuffledCards = shuffle(cards);
    this.playerRemainingCards.push(shuffledCards.slice(0, 13).sort(Card.compare));
    this.playerRemainingCards.push(shuffledCards.slice(13, 26).sort(Card.compare));
    this.playerRemainingCards.push(shuffledCards.slice(26, 39).sort(Card.compare));
    this.playerRemainingCards.push(shuffledCards.slice(39, 52).sort(Card.compare));
  }

  setTrumpAndFirstPlayer(trump, firstPlayerId) {
    this.trump = trump;
    this.nextPlayer = this.playerIds.indexOf(firstPlayerId);
  }

  playCard(playerId, card) {
    if (playerId !== this.playerIds[this.nextPlayer]) {
      // not this player's turn
      return false;
    }

    const order = this.playerIds.indexOf(playerId);

    const cardIdx = this.playerRemainingCards[order].indexOf(card);
    if (cardIdx == -1) {
      // player does not possess the card
      return false;
    }

    this.playerRemainingCards[order].splice(cardIdx, 1);
    this.currentRound.push(card);

    if (this.currentRound.length < 4) {
      this.nextPlayer = (order + 1) % 4;
    } else if (this.currentRound.length == 4) {
      const winner = this.calculateWinner();

      this.roundNumber += 1;
      this.nextPlayer = winner;
      this.currentRound = [];
      this.playerWinCounts[winner] += 1;
    }

    return true;
  }

  getState() {
    return {
      roundNumber: this.roundNumber,
      nextPlayer: this.nextPlayer,
      currentRound: this.currentRound,
      playerRemainingCards: this.playerRemainingCards,
      playerWinCounts: this.playerWinCounts,

      trump: this.trump,

      playerIds: this.playerIds,
      playerUsernames: this.playerUsernames,
    }
  }

  calculateWinner() {
    const hasTrump = this.trump === 'NT' ? false : this.currentRound.some((card) => card.getSuit() === this.trump);

    if (hasTrump) {
      return this.getLargestWithTrump(this.currentRound, this.trump);
    } else {
      return this.getLargestWithTrump(this.currentRound, this.currentRound[0].getSuit());
    }
  }

  getLargestWithTrump(cards, trump) {
    let winner = -1;
    for (let i = 0; i < 4; i++) {
      const card = cards[i];
      if (card.getSuit() != trump) {
        continue;
      } else if (winner == -1) {
        winner = i;
      } else if (Class.compareRank(card, cards[winner]) === 1) {
        winner = i;
      }
    }

    return winner;
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
    console.log(`Received setup game event for ${roomNumber}, trump is ${trump} and firstPlayerId is ${firstPlayerId}`);

    game[roomNumber].setTrumpAndFirstPlayer(trump, firstPlayerId);

    io.to(roomNumber).emit('game set', game[roomNumber].getState());
  });

  socket.on('play card', (roomNumber, playerId, card) => {
    console.log(`player ${playerId} played card ${card}.`);

    const result = game[roomNumber].playCard(playerId, new Card(card));
    if (!result) {
      return;
    }

    const state = game[roomNumber].getState();
    console.log(state);

    io.to(roomNumber).emit('card played', state);
  })
};
