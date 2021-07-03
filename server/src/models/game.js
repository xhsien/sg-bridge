module.exports = class Game {
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
      const hasTrump = this.trump === 'NT' ? false : this.currentRound.some((card) => card[0] === this.trump);
  
      if (hasTrump) {
        return this.getLargestWithTrump(this.currentRound, this.trump);
      } else {
        return this.getLargestWithTrump(this.currentRound, this.currentRound[0][0]);
      }
    }
  
    getLargestWithTrump(cards, trump) {
      let winner = -1;
      for (let i = 0; i < 4; i++) {
        const card = cards[i];
        if (card[0] != trump) {
          continue;
        } else if (winner == -1) {
          winner = i;
        } else if (this.rankLarger(card, cards[winner])) {
          winner = i;
        }
      }
  
      return winner;
    }
  
    rankLarger(card1, card2) {
      const rank1 = card1[1];
      const rank2 = card2[1];
      const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      return rankOrder.indexOf(rank1) > rankOrder.indexOf(rank2);
    }
  };

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