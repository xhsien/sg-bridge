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
      height: '60vh',
    },
    top: {
      height: '20vh',
    },
    left: {
      width: '5vw',
    },
    center: {
      width: '70vw',
      margin: 'auto',
    },
    right: {
      width: '5vw',
    },
    bottom: {
      height: '20vh',
    },
    table : {
      verticalContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '10vw'
      },
      horizontalContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '50vh',
      },
      top: {
        margin: 'auto',
      },
      left: {
        margin: 'auto',
      },
      right: {
        margin: 'auto',
      },
      bottom: {
        margin: 'auto',
      },
    }
  },
};