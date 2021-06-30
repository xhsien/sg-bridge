import EntryView from './components/entryView.js';
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
      username: null,
      roomNumber: null,
      players: null,
    };
  }

  onUsernameChanged(username) {
    this.setState({
      username: username,
    });
  }

  onRoomNumberChanged(roomNumber) {
    this.setState({
      roomNumber: roomNumber,
      players: [
        this.state.username,
      ],
    });
  }

  onCreateRoom() {
    if (!this.state.username) {
      alert('Missing username.');
      return;
    }

    socket.auth = { username: this.state.username };
    socket.connect();

    socket.emit('new room', (response) => {
      this.setState({
        view: 'ROOM_VIEW',
        roomNumber: response.roomNumber,
        players: response.players,
      });
    });

    socket.on('room update', (players) => {
      this.setState({
        players: players,
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

    socket.emit('join room', this.state.roomNumber, (response) => {
      console.log(response);

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

    socket.on('room update', (players) => {
      this.setState({
        players: players,
      });
    });
  }

  getView() {
    switch (this.state.view) {
      case 'GAME_VIEW':
      case 'ROOM_VIEW':
        return (
          <RoomView
            roomNumber = {this.state.roomNumber}
            players = {this.state.players}
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
