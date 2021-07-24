import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from "react";
import { styles } from "./styles.js";

export default class GameView extends React.Component {
  state = {
    showConfigSelection: true,
    selectedTrump: null,
    selectedFirstPlayerId: null,

    // game state
    roundNumber: null,
    nextPlayer: null,
    currentRound: null,
    currentRoundPlayers: null,
    playerRemainingCards: null,
    playerWinCounts: [0, 0, 0, 0], //dummy init to prevent NPE

    // order is index of players in playerIds
    order: 0,
    order2: 0,
    order3: 0,
    order4: 0,

    // views
    cards: null,
    cards2: null,
    cards3: null,
    cards4: null,

  }

  componentDidMount() {
    this.props.eventRouter.registerOnGameSetListener('Game', () => {
      this.setState({
        showConfigSelection: false,
      });
    })

    this.props.eventRouter.registerOnGameStartedListener('Game', (gameState) => {
      console.log('received game started event');
      console.log(this.createCardsView(gameState.playerRemainingCards[this.state.order]))

      this.setState({
        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        currentRoundPlayers: gameState.currentRoundPlayers,
        playerRemainingCards: gameState.playerRemainingCards,
        playerWinCounts: gameState.playerWinCounts,

        cards: this.createCardsView(gameState.playerRemainingCards[this.state.order]),
        cards2: this.createCards2View(gameState.playerRemainingCards[this.state.order2]),
        cards3: this.createCards3View(gameState.playerRemainingCards[this.state.order3]),
        cards4: this.createCards4View(gameState.playerRemainingCards[this.state.order4]),

      });
    });

    this.props.eventRouter.registerOnCardPlayedListener('Game', (gameState) => {
      console.log('received card played event');

      this.setState({
        roundNumber: gameState.roundNumber,
        nextPlayer: gameState.nextPlayer,
        currentRound: gameState.currentRound,
        currentRoundPlayers: gameState.currentRoundPlayers,
        playerRemainingCards: gameState.playerRemainingCards,
        playerWinCounts: gameState.playerWinCounts,

        cards: this.createCardsView(gameState.playerRemainingCards[this.state.order]),
        cards2: this.createCards2View(gameState.playerRemainingCards[this.state.order2]),
        cards3: this.createCards3View(gameState.playerRemainingCards[this.state.order3]),
        cards4: this.createCards4View(gameState.playerRemainingCards[this.state.order4]),

      });
    });
  }

  componentWillUnmount() {
    this.props.eventRouter.removeAllListeners("Game");
  }

  createCardsView(cards) {
    return cards.map((card, idx) => {
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
  };

  createCards2View(cards) {
    return cards.map((card, idx) => {
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
  };

  createCards3View(cards) {
    return cards.map((card, idx) => {
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
  };

  createCards4View(cards) {
    return cards.map((card, idx) => {
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
  };

  constructor(props) {
    super(props);
    console.log("constructor")
    const order = props.playerIds.indexOf(this.props.id);
    this.state.order = order;
    this.state.order2 = (order + 1) % 4
    this.state.order3 = (order + 2) % 4
    this.state.order4 = (order + 3) % 4
  }

  render() {
    const order = this.state.order;
    const order2 = this.state.order2;
    const order3 = this.state.order3;
    const order4 = this.state.order4;



    const onTrumpChanged = (event) => {
      this.setState({
        selectedTrump: event.target.value,
      });
    }
  
    const onFirstPlayerChanged = (event) => {
      this.setState({
        selectedFirstPlayerId: event.target.value,
      });
    }

    const onSetupGame = () => {
      if (!this.state.selectedTrump) {
        alert('Missing trump.');
        return;
      }
      if (!this.state.selectedFirstPlayerId) {
        alert('Missing first player.');
        return;
      }
  
      this.props.eventRouter.emitSetupGame(this.props.roomNumber, this.state.selectedTrump, this.state.selectedFirstPlayerId, (response) => {
        if (response.error) {
          alert(response.error);
        }
      });
    }

    const configScreen = (
      <div>

        <FormControl component="fieldset" onChange = {onTrumpChanged}>
          <FormLabel component="legend">Trump</FormLabel>
          <RadioGroup>
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="H" control={<Radio />} label="H" />
            <FormControlLabel value="D" control={<Radio />} label="D" />
            <FormControlLabel value="C" control={<Radio />} label="C" />
            <FormControlLabel value="NT" control={<Radio />} label="NT" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" onChange = {onFirstPlayerChanged}>
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
            onClick = {onSetupGame}
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

    let cardImg = '';
    let cardImg2 = '';
    let cardImg3 = '';
    let cardImg4 = '';

    if (this.state.currentRound != null && this.state.currentRoundPlayers != null) {
      const card = this.state.currentRound[this.state.currentRoundPlayers.indexOf((order + 0) % 4)];
      const cardImageFilename = ('assets/' + card + '.png');
      cardImg = card === undefined ? '' : (
        <img src={cardImageFilename} alt={card} width="90" height="135"/>
      );
  
      const card2 = this.state.currentRound[this.state.currentRoundPlayers.indexOf((order + 1) % 4)];
      const cardImageFilename2 = ('assets/' + card2 + '.png');
      cardImg2 = card2 === undefined ? '' : (
        <img src={cardImageFilename2} alt={card2} width="90" height="135"/>
      );
  
      const card3 = this.state.currentRound[this.state.currentRoundPlayers.indexOf((order + 2) % 4)];
      const cardImageFilename3 = ('assets/' + card3 + '.png');
      cardImg3 = card3 === undefined ? '' : (
        <img src={cardImageFilename3} alt={card3} width="90" height="135"/>
      );
  
      const card4 = this.state.currentRound[this.state.currentRoundPlayers.indexOf((order + 3) % 4)];
      const cardImageFilename4 = ('assets/' + card4 + '.png');
      cardImg4 = card4 === undefined ? '' : (
        <img src={cardImageFilename4} alt={card4} width="90" height="135"/>
      );
    }

    const tableScreen = (
      <div style={styles.game.table.horizontalContainer}>

        <div style={styles.game.table.left}>
          {cardImg2}
        </div>

        <div style={styles.game.table.verticalContainer}>

          <div style={styles.game.table.top}>
            {cardImg3}
          </div>

          <div style={styles.game.table.bottom}>
            {cardImg}
          </div>

        </div>

        <div style={styles.game.table.right}>
          {cardImg4}
        </div>

      </div>
    );

    return (
      <div style={styles.main}>

        <div style={styles.game.verticalContainer}>

          <div style={styles.game.top}>
            {this.props.playerUsernames[order3]}
            ({this.state.playerWinCounts[order3]})
            <div style={styles.cardsHorizontal}>
              {this.state.cards3}
            </div>
          </div>

          <div style={styles.game.horizontalContainer}>

            <div style={styles.game.left}>
              {this.props.playerUsernames[order2]}
              ({this.state.playerWinCounts[order2]})
              <div style={styles.cardsVertical}>
                {this.state.cards2}
              </div>
            </div>

            <div style={styles.game.center}>
              {this.state.showConfigSelection && this.props.isHost ? configScreen : ""}
              {this.state.showConfigSelection && !this.props.isHost ? waitingScreen : ""}
              {!this.state.showConfigSelection ? tableScreen : ""}
            </div>

            <div style={styles.game.right}>
              {this.props.playerUsernames[order4]}
              ({this.state.playerWinCounts[order4]})
              <div style={styles.cardsVertical}>
                {this.state.cards4}
              </div>
            </div>

          </div>

          <div style={styles.game.bottom}>
            <div style={styles.cardsHorizontal}>
              {this.state.cards}
            </div>
            {this.props.username}
            ({this.state.playerWinCounts[order]})
          </div>

        </div>

      </div>
    );
  }
}