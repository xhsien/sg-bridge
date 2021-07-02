import Button from '@material-ui/core/Button';
import React from "react";
import TextField from '@material-ui/core/TextField';
import logo from "../logo.svg";
import { styles } from "./styles.js";

export default class EntryView extends React.Component {
  render() {
    return (
      <div style={styles.main}>

        <img src={logo} className="App-logo" alt="logo"/>

        <div style={styles.entry.username}>
          <TextField
            required
            label = 'Username'
            onChange = {(event) => this.props.onUsernameChanged(event.target.value)}
          />
        </div>

        <div style={styles.flex}>

          <div style={styles.entry.createRoomButton}>
            <Button
              variant = 'contained'
              onClick = {() => this.props.onCreateRoom()}
            >
              Create Room
            </Button>
          </div>

          <div style={styles.flex}>
            <TextField
              required
              label = 'Room number'
              onChange = {(event) => this.props.onRoomNumberChanged(event.target.value)}
            />
            <div style={styles.entry.joinRoomButton}>
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