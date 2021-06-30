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

export default class GameView extends React.Component {
  render() {
    return (
      <div style={styles.main}>
        GameView
      </div>
    );
  }
}