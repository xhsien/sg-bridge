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
    cardsVertical: {
    },
    cardsHorizontal: {
    },
    verticalContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    horizontalContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '70vh',
    },
    top: {
      height: '15vh',
    },
    left: {
      width: '15vw',
    },
    center: {
      width: '70vw',
      margin: 'auto',
    },
    right: {
      width: '15vw',
    },
    bottom: {
      height: '15vh',
    },
  },
};