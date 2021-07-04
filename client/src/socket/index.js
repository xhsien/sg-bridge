import { io } from 'socket.io-client';
import { config } from '../config.js';

const socket = io((process.env.REACT_APP_ENV === "heroku") ? config.REMOTE_HTTP_SERVER_URL : config.LOCAL_HTTP_SERVER_URL, {
  autoConnect: false,
});

export default socket;
