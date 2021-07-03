import EntryView from './components/entryView.js';
import GameView from './components/gameView.js';
import React from 'react';
import RoomView from './components/roomView.js';
import socket from './socket/index.js';
import './App.css';
import * as errors from "./errors";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.socket = socket;

    this.state = {
      view: 'ENTRY_VIEW', // ENTRY_VIEW, ROOM_VIEW, GAME_VIEW

      // player
      id: null,
      username: null,
      isHost: false,

      // room
      roomNumber: null,
      players: null,

      // game setup
      showConfigSelection: true,
      selectedTrump: null,
      selectedFirstPlayerId: null,

      // game players
      playerIds: null,
      playerUsernames: null,

      // game state
      roundNumber: null,
      nextPlayer: null,
      currentRound: null,
      playerRemainingCards: null,
      playerWinCounts: null,
    };
  }

  registerHandler(socket) {
    socket.on('connect', () => {
      this.setState({
        id: socket.id,
      });
    });

    socket.on('room update', (players) => {
      this.setState({
        players: players,
      });
    });

    socket.on('game started', (gameState) => {
      console.log('received game started event');

      this.setState({
        view: 'GAME_VIEW',

        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        playerRemainingCards: gameState.playerRemainingCards,
        playerWinCounts: gameState.playerWinCounts,

        playerIds: gameState.playerIds,
        playerUsernames: gameState.playerUsernames,
      });
    });

    socket.on('game set', (gameState) => {
      console.log('received game set event');

      this.setState({
        showConfigSelection: false,
        selectedTrump: gameState.selectedTrump,
        selectedFirstPlayerId: gameState.selectedFirstPlayerId,
      });
    });

    socket.on('card played', (gameState) => {
      console.log('received card played event');

      this.setState({
        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        playerRemainingCards: gameState.playerRemainingCards,
        playerWinCounts: gameState.playerWinCounts,
      });
    });
  }

  onUsernameChanged(username) {
    this.setState({
      username: username,
    });
  }

  onRoomNumberChanged(roomNumber) {
    this.setState({
      roomNumber: roomNumber,
    });
  }

  onCreateRoom() {
    if (!this.state.username) {
      alert('Missing username.');
      return;
    }

    socket.auth = { username: this.state.username };
    socket.connect();
    this.registerHandler(socket);

    socket.emit('new room', (response) => {
      this.setState({
        view: 'ROOM_VIEW',
        roomNumber: response.roomNumber,
        players: response.players,
        isHost: true,
      });
    });
  }

  onJoinRoom(roomNumber) {
    if (!this.state.username) {
      alert('Missing username.');
      return;
    }

    if (!this.state.roomNumber) {
      alert('Missing room number.');
      return;
    }

    socket.auth = { username: this.state.username };
    socket.connect();
    this.registerHandler(socket);

    socket.emit('join room', this.state.roomNumber, (response) => {
      if (response.error) {
        if (response.error === errors.ROOM_NOT_EXIST) {
          alert('Room does not exist.');
        } else if (response.error === errors.ROOM_FULL) {
          alert('Room is already full.');
        }
        return;
      }

      this.setState({
        view: 'ROOM_VIEW',
        roomNumber: this.state.roomNumber,
        players: response.data.players,
      });
    });
  }

  onStartButtonPressed() {
    console.log('emit start game');
    console.log(this.state.roomNumber);
    socket.emit('start game', this.state.roomNumber, (response) => {
      if (response.error) {
        alert(response.error);
      }
    });
  }

  onTrumpChanged(selectedTrump) {
    this.setState({
      selectedTrump: selectedTrump,
    });
  }

  onFirstPlayerChanged(selectedFirstPlayerId) {
    this.setState({
      selectedFirstPlayerId: selectedFirstPlayerId,
    });
  }

  onSetupGame() {
    if (!this.state.selectedTrump) {
      alert('Missing trump.');
      return;
    }
    if (!this.state.selectedFirstPlayerId) {
      alert('Missing first player.');
      return;
    }

    socket.emit('setup game', this.state.roomNumber, this.state.selectedTrump, this.state.selectedFirstPlayerId, (response) => {
      if (response.error) {
        alert(response.error);
      }
    });
  }

  onCardPressed(id, card) {
    socket.emit('play card', this.state.roomNumber, id, card, (response) => {
      if (response.error) {
        alert(response.error);
      }
    });
  }

  getView() {
    switch (this.state.view) {
      case 'GAME_VIEW':
        return (
          <GameView
            id = {this.state.id}
            username = {this.state.username}
            isHost = {this.state.isHost}

            showConfigSelection = {this.state.showConfigSelection}

            playerIds = {this.state.playerIds}
            playerUsernames = {this.state.playerUsernames}

            roundNumber = {this.state.roundNumber}
            nextPlayer = {this.state.nextPlayer}
            currentRound = {this.state.currentRound}
            playerRemainingCards = {this.state.playerRemainingCards}
            playerWinCounts = {this.state.playerWinCounts}

            onTrumpChanged = {(selectedTrump) => this.onTrumpChanged(selectedTrump)}
            onFirstPlayerChanged = {(selectedFirstPlayerId) => this.onFirstPlayerChanged(selectedFirstPlayerId)}
            onSetupGame = {() => this.onSetupGame()}

            onCardPressed = {(id, card) => this.onCardPressed(id, card)}
          />
        );
      case 'ROOM_VIEW':
        return (
          <RoomView
            roomNumber = {this.state.roomNumber}
            id = {this.state.id}
            username = {this.state.username}
            players = {this.state.players}
            isHost = {this.state.isHost}
            onStartButtonPressed = {() => this.onStartButtonPressed()}
          />
        );
      case 'ENTRY_VIEW':
      default:
        return (
          <EntryView
            onUsernameChanged = {(username) => this.onUsernameChanged(username)}
            onRoomNumberChanged = {(roomNumber) => this.onRoomNumberChanged(roomNumber)}
            onCreateRoom = {() => this.onCreateRoom()}
            onJoinRoom = {(roomNumber) => this.onJoinRoom(roomNumber)}
          />
        );
    }
  }

  render() {
    return (
      <div className="App">
        {this.getView()}
      </div>
    );
  }
}

export default App;
