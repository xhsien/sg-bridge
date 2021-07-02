import EntryView from './components/entryView.js';
import GameView from './components/gameView.js';
import React from 'react';
import RoomView from './components/roomView.js';
import socket from './socket/index.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.socket = socket;

    this.state = {
      view: 'ENTRY_VIEW', // ENTRY_VIEW, ROOM_VIEW, GAME_VIEW
      id: null,
      username: null,
      roomNumber: null,
      players: null,
      isHost: false,

      // game state
      roundNumber: null,
      nextPlayer: null,
      currentRound: null,
      playerRemainingCards: null,
      playerWinCounts: null,

      playerIds: null,
      playerUsernames: null,
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
      if (!response) {
        alert('Room does not exist.');
        return;
      }

      this.setState({
        view: 'ROOM_VIEW',
        roomNumber: this.state.roomNumber,
        players: response.players,
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

  onCardPressed(id, card) {
    socket.emit('', this.state.roomNumber, id, card, (response) => {
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

            roundNumber = {this.state.roundNumber}
            nextPlayer = {this.state.nextPlayer}
            currentRound = {this.state.currentRound}
            playerRemainingCards = {this.state.playerRemainingCards}
            playerWinCounts = {this.state.playerWinCounts}
            
            playerIds = {this.state.playerIds}
            playerUsernames = {this.state.playerUsernames}

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
