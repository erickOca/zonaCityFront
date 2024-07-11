import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject, map } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { MessageData } from '../models/MessageData';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  
  constructor() {
    this.socket = new WebSocket('ws://localhost:8080/ws');
  }
  
  public connect(): Observable<any> {
    return new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }
}