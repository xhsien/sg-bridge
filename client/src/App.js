import EntryView from './components/entryView.js';
import GameView from './components/gameView.js';
import React from 'react';
import RoomView from './components/roomView.js';
import './App.css';
import * as errors from "./errors";
import EventRouter from "./EventRouter"

class App extends React.Component {
  constructor(props) {
    super(props);

    this.eventRouter = new EventRouter();

    this.state = {
      view: 'ENTRY_VIEW', // ENTRY_VIEW, ROOM_VIEW, GAME_VIEW

      // player
      id: null,
      username: null,
      isHost: false,

      // room
      roomNumber: null,
      players: null,

      // game players
      playerIds: null,
      playerUsernames: null,

    };
  }

  registerHandler() {
    this.eventRouter.registerOnConnectListener('App', () => {
      this.setState({
        id: this.eventRouter.getSocketId(),
      });
    });

    this.eventRouter.registerOnRoomUpdateListener('App', (players) => {
      this.setState({
        players: players,
      });
    });

    this.eventRouter.registerOnGameStartedListener('App', (gameState) => {
      this.setState({
        view: 'GAME_VIEW',

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

    this.eventRouter.connect(this.state.username);
    this.registerHandler();

    this.eventRouter.emitNewRoom((response) => {
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

    this.eventRouter.connect(this.state.username);
    this.registerHandler();

    this.eventRouter.emitJoinRoom(this.state.roomNumber, (response) => {
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

  getView() {
    switch (this.state.view) {
      case 'GAME_VIEW':
        return (
          <GameView
            id = {this.state.id}
            username = {this.state.username}
            roomNumber = {this.state.roomNumber}
            isHost = {this.state.isHost}

            playerIds = {this.state.playerIds}
            playerUsernames = {this.state.playerUsernames}

            eventRouter={this.eventRouter}
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
            eventRouter={this.eventRouter}
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
