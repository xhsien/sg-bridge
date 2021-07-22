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
      currentRoundPlayers: null,
      playerRemainingCards: null,
      playerWinCounts: null,
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
      console.log('received game started event');

      this.setState({
        view: 'GAME_VIEW',

        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        currentRoundPlayers: gameState.currentRoundPlayers,
        playerRemainingCards: gameState.playerRemainingCards,
        playerWinCounts: gameState.playerWinCounts,

        playerIds: gameState.playerIds,
        playerUsernames: gameState.playerUsernames,
      });
    });

    this.eventRouter.registerOnGameSetListener('App', (gameState) => {
      console.log('received game set event');

      this.setState({
        showConfigSelection: false,
        selectedTrump: gameState.selectedTrump,
        selectedFirstPlayerId: gameState.selectedFirstPlayerId,
      });
    });

    this.eventRouter.registerOnCardPlayedListener('App', (gameState) => {
      console.log('received card played event');

      this.setState({
        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        currentRoundPlayers: gameState.currentRoundPlayers,
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

  onStartButtonPressed() {
    console.log('emit start game');
    console.log(this.state.roomNumber);
    this.eventRouter.emitStartGame(this.state.roomNumber, (response) => {
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

    this.eventRouter.emitSetupGame(this.state.roomNumber, this.state.selectedTrump, this.state.selectedFirstPlayerId, (response) => {
      if (response.error) {
        alert(response.error);
      }
    });
  }

  onCardPressed(id, card) {
    this.eventRouter.emitPlayCard(this.state.roomNumber, id, card, (response) => {
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
            currentRoundPlayers = {this.state.currentRoundPlayers}
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
