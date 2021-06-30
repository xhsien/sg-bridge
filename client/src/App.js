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

    socket.on('game started', () => {
      console.log('received game started event');

      this.setState({
        view: 'GAME_VIEW',
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
    socket.emit('start game', this.state.roomNumber);
  }

  getView() {
    switch (this.state.view) {
      case 'GAME_VIEW':
        return (
          <GameView
          />
        );
      case 'ROOM_VIEW':
        return (
          <RoomView
            roomNumber = {this.state.roomNumber}
            id = {this.state.id}
            username = {this.state.username}
            players = {this.state.players}
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
