import Button from '@material-ui/core/Button';
import React from "react";
import { styles } from "./styles.js";

export default class RoomView extends React.Component {
  render() {
    const players = this.props.players;

    const playersList = players.map((player, idx) => {
      return (
        <div> &nbsp; {player.username} {player.isHost ? '(Host)' : ''} </div>
      );
    });

    const isHost = players.filter((player) => player.isHost)[0].id === this.props.id;

    const startButton = <Button
                          variant = 'contained'
                          onClick={() => {
                            console.log('emit start game');
                            console.log(this.props.roomNumber);
                            this.props.eventRouter.emitStartGame(this.props.roomNumber, (response) => {
                              if (response.error) {
                                alert(response.error);
                              }
                            });
                          }}
                        >
                          Start
                        </Button>;

    const waitText = <div> Waiting for host to start ... </div>;

    return (
      <div style={styles.main}>
        <div style={styles.room.room}>
          ROOM {this.props.roomNumber}
        </div>

        <div style={styles.room.players}>
          <div style={styles.flex}> Player 1 : {playersList[0]} </div>
          <div style={styles.flex}> Player 2 : {playersList[1]} </div>
          <div style={styles.flex}> Player 3 : {playersList[2]} </div>
          <div style={styles.flex}> Player 4 : {playersList[3]} </div>
        </div>

        <div>
          {isHost ? startButton : waitText}
        </div>
      </div>
    );
  }
}