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
    const order2 = (order + 1) % 4
    const order3 = (order + 2) % 4
    const order4 = (order + 3) % 4

    const cards = this.props.playerRemainingCards[order].map((card, idx) => {
      const cardImageFilename = 'assets/' + card + '.png';
      return (
        <Button
          key = {idx}
          onClick = {() => this.props.onCardPressed(this.props.id, card)}
        >
          <img src={cardImageFilename} alt={card} width="60" height="90"/>
        </Button>
      );
    });

    const cards2 = this.props.playerRemainingCards[order2].map((card, idx) => {
      const cardImageFilename = 'assets/back_rotate.png';
      return (
        <div>
          <Button
            key = {idx}
            disabled
          >
            <img src={cardImageFilename} alt='back' width="50" height="35"/>
          </Button>
        </div>
      );
    });

    const cards3 = this.props.playerRemainingCards[order3].map((card, idx) => {
      const cardImageFilename = 'assets/back.png';
      return (
        <Button
          key = {idx}
          disabled
        >
          <img src={cardImageFilename} alt='back' width="60" height="90"/>
        </Button>
      );
    });

    const cards4 = this.props.playerRemainingCards[order4].map((card, idx) => {
      const cardImageFilename = 'assets/back_rotate.png';
      return (
        <div>
          <Button
            key = {idx}
            disabled
          >
            <img src={cardImageFilename} alt='back' width="50" height="35"/>
          </Button>
        </div>
      );
    });

    const configScreen = (
      <div>

        <FormControl component="fieldset" onChange = {(event) => this.props.onTrumpChanged(event.target.value)}>
          <FormLabel component="legend">Trump</FormLabel>
          <RadioGroup>
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="H" control={<Radio />} label="H" />
            <FormControlLabel value="D" control={<Radio />} label="D" />
            <FormControlLabel value="C" control={<Radio />} label="C" />
            <FormControlLabel value="NT" control={<Radio />} label="NT" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" onChange = {(event) => this.props.onFirstPlayerChanged(event.target.value)}>
          <FormLabel component="legend">First Player</FormLabel>
          <RadioGroup>
            <FormControlLabel value={this.props.playerIds[order]} control={<Radio />} label={this.props.playerUsernames[order]} />
            <FormControlLabel value={this.props.playerIds[order2]} control={<Radio />} label={this.props.playerUsernames[order2]} />
            <FormControlLabel value={this.props.playerIds[order3]} control={<Radio />} label={this.props.playerUsernames[order3]} />
            <FormControlLabel value={this.props.playerIds[order4]} control={<Radio />} label={this.props.playerUsernames[order4]} />
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
        Waiting for host to select trump and first player...
      </div>
    );

    return (
      <div style={styles.main}>

        <div style={styles.game.verticalContainer}>

          <div style={styles.game.top}>
            {this.props.playerUsernames[order3]}
            <div style={styles.cardsHorizontal}>
              {cards3}
            </div>
          </div>

          <div style={styles.game.horizontalContainer}>

            <div style={styles.game.left}>
              {this.props.playerUsernames[order2]}
              <div style={styles.cardsVertical}>
                {cards2}
              </div>
            </div>

            <div style={styles.game.center}>
              {this.props.showConfigSelection && this.props.isHost ? configScreen : ""}
              {this.props.showConfigSelection && !this.props.isHost ? waitingScreen : ""}
            </div>

            <div style={styles.game.right}>
              {this.props.playerUsernames[order4]}
              <div style={styles.cardsVertical}>
                {cards4}
              </div>
            </div>

          </div>

          <div style={styles.game.bottom}>
            <div style={styles.cardsHorizontal}>
              {cards}
            </div>
            {this.props.username}
          </div>

        </div>

      </div>
    );
  }
}