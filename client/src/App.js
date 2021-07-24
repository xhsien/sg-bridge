import EntryView from './components/entryView.js';
import GameView from './components/gameView.js';
import React from 'react';
import RoomView from './components/roomView.js';
import './App.css';
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

  registerHandler = () => {
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

  onCreatedRoom = (roomNumber, username, players) => {
    this.setState({
      view: 'ROOM_VIEW',
      username: username, 
      roomNumber: roomNumber,
      players: players,
      isHost: true,
    });
  }

  onJoinedRoom = (username, roomNumber, players) => {
    this.setState({
      view: 'ROOM_VIEW',
      username: username, 
      roomNumber: roomNumber,
      players: players,
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
            onCreatedRoom = {this.onCreatedRoom}
            onJoinedRoom = {this.onJoinedRoom}
            onConnected = {this.registerHandler}
            eventRouter = {this.eventRouter}
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
