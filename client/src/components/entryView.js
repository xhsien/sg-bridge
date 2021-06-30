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
  }
}

export default class EntryView extends React.Component {
  render() {
    return (
      <div style={styles.main}>
        <img src={logo} className="App-logo" alt="logo"/>
        <TextField
          required
          label = 'Username'
          onChange = {(event) => this.props.onUsernameChanged(event.target.value)}
          style={styles.username}
        />
        <Button
          variant = 'contained'
          style = {{marginRight: '10px'}}
          onClick = {() => this.props.onCreateRoom()}
        >
          Create Room
        </Button>
        <TextField
          required
          label = 'Room number'
          onChange = {(event) => this.props.onRoomNumberChanged(event.target.value)}
        />
        <Button
          variant = 'contained'
          onClick = {() => this.props.onJoinRoom()}
        >
          Join Room
        </Button>
      </div>
    );
  }
}