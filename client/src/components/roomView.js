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

    return (
      <div style={styles.main}>
        <div>
          Room: {this.props.roomNumber}
        </div>
        <div>
          <ol>{playersList}</ol>
        </div>
      </div>
    );
  }
}