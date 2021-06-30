import Button from '@material-ui/core/Button';
import React from "react";
import TextField from '@material-ui/core/TextField';
import logo from "../logo.svg";

const styles = {
  main: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
  username: {
    marginBottom: '100px',
  },
  roomContainer: {
    display: 'flex',
  },
  createRoom: {
    marginRight: '100px',
    marginTop: '8px',
  },
  joinRoomContainer: {
    display: 'flex',
  },
  joinRoomJoin: {
    marginLeft: '10px',
    marginTop: '8px',
  },
}

export default class EntryView extends React.Component {
  render() {
    return (
      <div style={styles.main}>

        <img src={logo} className="App-logo" alt="logo"/>

        <div style={styles.username}>
          <TextField
            required
            label = 'Username'
            onChange = {(event) => this.props.onUsernameChanged(event.target.value)}
          />
        </div>

        <div style={styles.roomContainer}>

          <div style={styles.createRoom}>
            <Button
              variant = 'contained'
              onClick = {() => this.props.onCreateRoom()}
            >
              Create Room
            </Button>
          </div>

          <div style={styles.joinRoomContainer}>
            <TextField
              required
              label = 'Room number'
              onChange = {(event) => this.props.onRoomNumberChanged(event.target.value)}
            />
            <div style={styles.joinRoomJoin}>
              <Button
                variant = 'contained'
                onClick = {() => this.props.onJoinRoom()}
              >
                Join
              </Button>
            </div>
          </div>

        </div>

      </div>
    );
  }
}