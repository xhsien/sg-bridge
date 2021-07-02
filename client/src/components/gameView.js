import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
  cards: {
    flexDirection: 'row',
  }
}

export default class GameView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfigSelection: false,
      selectedTrump: null,
      selectedFirstPlayerId: null,
    }
  }

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
      <div>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Trump</FormLabel>
          <RadioGroup aria-label="gender" name="selectTrump">
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="H" control={<Radio />} label="H" />
            <FormControlLabel value="D" control={<Radio />} label="D" />
            <FormControlLabel value="C" control={<Radio />} label="C" />
          </RadioGroup>
        </FormControl>
        <div>
          <Button variant='contained' onClick={()=>this.setState({selectedTrump: 'S'})}>S</Button>
          <Button variant='contained' onClick={()=>this.setState({selectedTrump: 'H'})}>H</Button>
          <Button variant='contained' onClick={()=>this.setState({selectedTrump: 'C'})}>C</Button>
          <Button variant='contained' onClick={()=>this.setState({selectedTrump: 'D'})}>D</Button>
          <Button variant='contained' onClick={()=>this.setState({selectedTrump: 'NT'})}>NT</Button>
        </div>
        <div>
          <Button variant='contained'>{this.props.playerUsernames[(order + 0) % 4]}</Button>
          <Button variant='contained'>{this.props.playerUsernames[(order + 1) % 4]}</Button>
          <Button variant='contained'>{this.props.playerUsernames[(order + 2) % 4]}</Button>
          <Button variant='contained'>{this.props.playerUsernames[(order + 3) % 4]}</Button>
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
          {this.props.isHost ? configScreen : waitingScreen}
        </div>
      </div>
    );
  }
}