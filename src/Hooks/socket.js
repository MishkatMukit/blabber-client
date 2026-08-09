import { io } from 'socket.io-client';
const socket = io('https://blabber-server-production.up.railway.app', {
  autoConnect: false
});

export default socket;