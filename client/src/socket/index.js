import { io } from 'socket.io-client';
import { config } from '../config.js';

const socket = io(config.HTTP_SERVER_URL, {
  autoConnect: false,
});

export default socket;
