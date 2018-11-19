import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  socket: any;
  userName: string = '';
  constructor() {
    window.addEventListener('unload', (event) => {
      this.socket && this.socket.removeAllListeners('new_study');
      this.socket && this.socket.io && this.socket.io.disconnect();
      this.socket && this.socket.io && this.socket.io.destroy();
      this.socket = null;
    });
     console.log('socket initiate')
    this.socket = io.connect({ transports: ['websocket'] }).on('user', (user) => {
      if (user != this.userName)
        alert(user + ' has logged in');
    });
  }
}
