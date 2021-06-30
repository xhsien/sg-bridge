import Button from '@material-ui/core/Button';
import React from "react";

const styles = {
  main: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'black',
  },
  username: {
    marginBottom: '100px',
  }
}

export default class RoomView extends React.Component {
  render() {
    const players = this.props.players;

    const playersList = players.map((player, idx) => {
      return (
        <li key={idx}>
          {player.username} {player.isHost ? '(Host)' : ''}
        </li>
      );
    });

    const isHost = players.filter((player) => player.isHost)[0].id === this.props.id;

    let startButton;
    if (isHost) {
      startButton = <Button onClick={() => this.props.onStartButtonPressed()}>Start</Button>;
    }

    return (
      <div style={styles.main}>
        <div>
          Room: {this.props.roomNumber}
        </div>
        <div>
          <ol>{playersList}</ol>
        </div>
        {startButton}
      </div>
    );
  }
}