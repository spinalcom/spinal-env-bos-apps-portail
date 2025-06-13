import io from 'socket.io-client';
import { subscribe } from './subscribe.js';
import { SpinalAPI } from '../spinalAPI/SpinalAPI.ts';

const options = {
    auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJuYW1lIjoiYWRtaW4iLCJ0eXBlIjoiQURNSU4iLCJpZCI6ImU2MmYtODljMy1kMmJmLTE4ZTMzNWM0NzU3IiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTczNjQzOTQ0MzkxOSwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzEwMjU4NjY5Mzk5LCJ1c2VyTmFtZSI6ImFkbWluIiwidXNlclR5cGUiOiJBRE1JTiJ9LCJpYXQiOjE3MzcwMjc5ODUsImV4cCI6MTczNzYzMjc4NX0.o2WTha3zWcZIfurBKzkGIYrF6AoHP0-NpU5B8QDJ5m8'
    },
    transports: ['websocket'],
}
const connectSocket = () => {
    const buildingId = localStorage.getItem('idBuilding');
    const  token = localStorage.getItem('token');
   const url = SpinalAPI.getInstance().createUrlWithPlatformId(buildingId!, '');
   const optionsWebsocket = {
    auth: {
      token: token,
    },
    transports: ['websocket'],
  }  
    const socket = io(url, optionsWebsocket);
     
    return socket;
}

export default connectSocket;