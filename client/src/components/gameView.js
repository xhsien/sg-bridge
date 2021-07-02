import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from "react";
import { styles } from "./styles.js";

export default class GameView extends React.Component {
  render() {
    const order = this.props.playerIds.indexOf(this.props.id);

    const cards = this.props.playerRemainingCards[order].map((card, idx) => {
      return (
        <Button
          variant = 'contained'
          onClick = {() => this.props.onCardPressed(this.props.id, card)}
        >
          {card}
        </Button>
      );
    });

    const configScreen = (
      <div style={styles.flex}>

        <FormControl component="fieldset" onChange = {(event) => this.props.onTrumpChanged(event.target.value)}>
          <FormLabel component="legend">Select Trump</FormLabel>
          <RadioGroup>
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="H" control={<Radio />} label="H" />
            <FormControlLabel value="D" control={<Radio />} label="D" />
            <FormControlLabel value="C" control={<Radio />} label="C" />
            <FormControlLabel value="NT" control={<Radio />} label="NT" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" onChange = {(event) => this.props.onFirstPlayerChanged(event.target.value)}>
          <FormLabel component="legend">Select First Player</FormLabel>
          <RadioGroup>
            <FormControlLabel value={this.props.playerIds[(order + 0) % 4]} control={<Radio />} label={this.props.playerUsernames[(order + 0) % 4]} />
            <FormControlLabel value={this.props.playerIds[(order + 1) % 4]} control={<Radio />} label={this.props.playerUsernames[(order + 1) % 4]} />
            <FormControlLabel value={this.props.playerIds[(order + 2) % 4]} control={<Radio />} label={this.props.playerUsernames[(order + 2) % 4]} />
            <FormControlLabel value={this.props.playerIds[(order + 3) % 4]} control={<Radio />} label={this.props.playerUsernames[(order + 3) % 4]} />
          </RadioGroup>
        </FormControl>

        <div>
          <Button
            variant = 'contained'
            onClick = {() => this.props.onSetupGame()}
          >
            Start
          </Button>
        </div>

      </div>
    );

    const waitingScreen = (
      <div>
        Waiting for host to select trump and first player.
      </div>
    );

    return (
      <div style={styles.main}>
        <div>{this.props.username}</div>
        <div>
          <div>
            Your cards:
            <div style={styles.cards}>
              {cards}
            </div>
          </div>
          <div>
            {this.props.playerUsernames[(order + 1) % 4]}
          </div>
          <div>
            {this.props.playerUsernames[(order + 2) % 4]}
          </div>
          <div>
            {this.props.playerUsernames[(order + 3) % 4]}
          </div>
            {this.props.showConfigSelection && this.props.isHost ? configScreen : ""}
            {this.props.showConfigSelection && !this.props.isHost ? waitingScreen : ""}
        </div>
      </div>
    );
  }
}