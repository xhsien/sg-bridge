import Button from '@material-ui/core/Button';
import React from "react";
import TextField from '@material-ui/core/TextField';
import logo from "../logo.svg";
import { styles } from "./styles.js";
import * as errors from "../errors";

export default class EntryView extends React.Component {
  state = {
    username: null,
    roomNumber: null,
  };

  render() {
    const onUsernameChanged = (event) => {
      this.setState({
        username: event.target.value
      });
    }
  
    const onRoomNumberChanged = (event) => {
      this.setState({
        roomNumber: event.target.value
      });
    }
  
    const onJoinRoom = () => {
      if (!this.state.username) {
        alert('Missing username.');
        return;
      }
  
      if (!this.state.roomNumber) {
        alert('Missing room number.');
        return;
      }
  
      this.props.eventRouter.connect(this.state.username);
      this.props.onConnected();
  
      this.props.eventRouter.emitJoinRoom(this.state.roomNumber, (response) => {
        if (response.error) {
          if (response.error === errors.ROOM_NOT_EXIST) {
            alert('Room does not exist.');
          } else if (response.error === errors.ROOM_FULL) {
            alert('Room is already full.');
          }
          return;
        }

        this.props.onJoinedRoom(this.state.username, this.state.roomNumber, response.data.players);
      });
    }
  
    const onCreateRoom = () => {
      if (!this.state.username) {
        alert('Missing username.');
        return;
      }
  
      this.props.eventRouter.connect(this.state.username);
      this.props.onConnected();
      
      this.props.eventRouter.emitNewRoom((response) => {
        this.props.onCreatedRoom(response.roomNumber, this.state.username, response.players);
      });
    }
    
    return (
      <div style={styles.main}>

        <img src={logo} className="App-logo" alt="logo"/>

        <div style={styles.entry.username}>
          <TextField
            required
            label = 'Username'
            onChange = {onUsernameChanged}
          />
        </div>

        <div style={styles.flex}>

          <div style={styles.entry.createRoomButton}>
            <Button
              variant = 'contained'
              onClick = {onCreateRoom}
            >
              Create Room
            </Button>
          </div>

          <div style={styles.flex}>
            <TextField
              required
              label = 'Room number'
              onChange = {onRoomNumberChanged}
            />
            <div style={styles.entry.joinRoomButton}>
              <Button
                variant = 'contained'
                onClick = {onJoinRoom}
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