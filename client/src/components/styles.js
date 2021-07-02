export const styles = {
  main: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
  },
  flex: {
    display: 'flex',
  },
  entry: {
    username: {
      marginBottom: '100px',
    },
    createRoomButton: {
      marginRight: '100px',
      marginTop: '8px',
    },
    joinRoomButton: {
      marginLeft: '10px',
      marginTop: '8px',
    },
  },
  room: {
    room: {
      fontWeight: 'bold',
      fontSize: '150%',
    },
    players: {
      marginTop: '30px',
      marginBottom: '30px',
    },
  },
  game: {
    cards: {
      flexDirection: 'row',
    },
  },
};